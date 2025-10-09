import mongoose from 'mongoose';
import { Pedido } from "../domain/pedido/Pedido.js";
import { ItemPedido } from "../domain/pedido/ItemPedido.js";
import { EstadoPedido } from '../domain/pedido/enums.js';
import { DireccionEntrega } from "../domain/pedido/DireccionEntrega.js";
import { InvalidIdError, NotFoundError, ValidationError } from '../errors/AppError.js';

export class PedidoService {
  constructor(pedidoRepository, productoService, usuarioRepository, notificacionesService) {
    this.pedidoRepository = pedidoRepository;
    this.productoService = productoService;
    this.notificacionesService = notificacionesService
    this.usuarioRepository = usuarioRepository;
  }

  // Crear un nuevo pedido
  async crearPedido(compradorId, items, moneda, direccionEntrega) {
    if (!mongoose.Types.ObjectId.isValid(compradorId)) {
      throw new InvalidIdError('Usuario ID');
    }

    //Validar que comprador exista/tenga cuenta creada
    const comprador = await this.usuarioRepository.findById(compradorId);
    if (!comprador) {
      throw new NotFoundError('Comprador', compradorId);
    }

    //Instancio items con validacion interna
    const itemsInstancia = items.map(item =>
      new ItemPedido(
        item.productoId, // referencia a Producto
        item.cantidad,
        item.precioUnitario
      )
    );

    //Instancio direcc con validacion interna
    const direccionEntregaInstancia = new DireccionEntrega(
      direccionEntrega.calle,
      direccionEntrega.altura,
      direccionEntrega.piso,
      direccionEntrega.departamento,
      direccionEntrega.codPostal,
      direccionEntrega.ciudad,
      direccionEntrega.provincia,
      direccionEntrega.pais,
      direccionEntrega.lat,
      direccionEntrega.lon
    );

    //Instancio pedido con validacion interna
    const pedido = new Pedido(
      compradorId,
      itemsInstancia,
      moneda,
      direccionEntregaInstancia
    );

    // Validar stock de todos los productos
    for (const item of pedido.items) {
      if (!(await this.productoService.tieneStockSuficiente(item.productoId, item.cantidad))) {
        throw new ValidationError("Stock insuficiente para uno o más productos");
      }
    }

    //SI SE CREA EL PEDIDO, EL VENDEDOR DISMINUYE EL STOCK (BAJAR STOCK)
    for (const item of items) {
      await this.productoService.disminuirStock(item.productoId, item.cantidad);
    }

    // Guardar pedido en la base de datos
    const pedidoCreado = await this.pedidoRepository.save(pedido);

    //Despachar notificaciones tras creación del pedido (asincrónico)
    await this.notificacionesService
      .despacharPorEstado(pedidoCreado, EstadoPedido.CONFIRMADO)
      .catch((err) => console.error("Error al notificar pedido:", err));

    return pedidoCreado;
  }

  // Listar todos los pedidos
  async listarPedidos() {
    return await this.pedidoRepository.findAll();
  }

  async actualizarEstadoPedido(pedidoId, nuevoEstado, quien, motivo) {
    if (!mongoose.Types.ObjectId.isValid(pedidoId)) {
      throw new InvalidIdError('Pedido ID');
    }

    const pedido = await this.pedidoRepository.findById(pedidoId);
    if (!pedido) {
      throw new Error(`Producto con ID ${producto._id} no encontrado`);
    }

    // No permitir cancelar un pedido ya cancelado
    if (pedido.estado === EstadoPedido.CANCELADO && nuevoEstado === EstadoPedido.CANCELADO) {
      throw new Error("El pedido ya fue cancelado previamente.");
    }

    //Actualizar pedido en BD
    await this.pedidoRepository.findByIdAndUpdateEstado(pedidoId, nuevoEstado, quien, motivo)

    //Notificaciones por cambio de estado
    await this.notificacionesService.despacharPorEstado(pedido, nuevoEstado);

    return pedido;
  }

  // Cancelar pedido
  async cancelarPedido(pedidoId, compradorId) {
    const pedidoPlano = await this.pedidoRepository.findById(pedidoId);
    if (!pedidoPlano) throw new Error("Pedido no encontrado");

    if (pedidoPlano.compradorId !== compradorId) {
      throw new Error("No autorizado: solo el comprador puede cancelar su pedido");
    }

    if (pedidoPlano.estado === "ENVIADO") {
      throw new Error("El pedido ya fue enviado y no puede cancelarse");
    } else if (pedidoPlano.estado === "CANCELADO") {
      throw new Error("El pedido fue anteriormente cancelado");
    }

    const direccionEntregaInstancia = new DireccionEntrega(
      pedidoPlano.direccionEntrega.calle,
      pedidoPlano.direccionEntrega.altura,
      pedidoPlano.direccionEntrega.piso,
      pedidoPlano.direccionEntrega.departamento,
      pedidoPlano.direccionEntrega.codPostal,
      pedidoPlano.direccionEntrega.ciudad,
      pedidoPlano.direccionEntrega.provincia,
      pedidoPlano.direccionEntrega.pais,
      pedidoPlano.direccionEntrega.lat,
      pedidoPlano.direccionEntrega.lon
    );

    const pedido = new Pedido(
      pedidoPlano.compradorId,
      pedidoPlano.items.map(i => new ItemPedido(i.productoId, i.cantidad, i.precioUnitario)),
      pedidoPlano.moneda,
      direccionEntregaInstancia
    );

    pedido.id = pedidoPlano.id;
    pedido.estado = pedidoPlano.estado;
    pedido.historialEstados = pedidoPlano.historialEstados;

    //SI SE CANCELA EL PEDIDO, EL VENDEDOR RECUPERA EL STOCK (AUMENTAR STOCK)
    for (const item of pedido.items) {
      await this.productoService.aumentarStock(item.productoId, item.cantidad);
    }

    return await this.actualizarEstadoPedido(pedido.id, pedido.estado, compradorId, "Cancelación por el usuario");
  }

  // Obtener pedidos de un usuario
  async obtenerPedidosDeUsuario(usuarioId) {
    const todos = await this.pedidoRepository.findAll();
    return todos.filter(
      p => p.compradorId.toString() === usuarioId.toString()
    );
  }

  // Marcar pedido como enviado
  async marcarComoEnviado(pedidoId, vendedorId) {
    const pedidoPlano = await this.pedidoRepository.findById(pedidoId);
    if (!pedidoPlano) throw new Error("Pedido no encontrado");

    /*
    // Validar que el vendedor esté en los productos de los items del pedido
    const productos = await Promise.all(
      pedidoPlano.items.map(i => this.productoRepository.findById(i.productoId).lean())
    );
    if (productos.some(p => !p)) {
      throw new Error("Alguno de los productos del pedido no existe");
    }

    const vendedoresIds = productos.map(p => p.vendedor.toString());

    // Si el pedido tiene productos de múltiples vendedores,
    // obligás a que todos sean del vendedor actual.
    const todosDelMismoVendedor = vendedoresIds.every(
      id => id === vendedorId.toString()
    );

    if (!todosDelMismoVendedor) {
      throw new Error("No autorizado para marcar este pedido como enviado");
    }*/ // TODO: Revisar esta validación

    if (pedidoPlano.estado === "ENVIADO") {
      throw new Error("El pedido ya fue enviado");
    } else if (pedidoPlano.estado === "CANCELADO") {
      throw new Error("El pedido fue cancelado y no puede enviarse");
    }

    const direccionEntregaInstancia = new DireccionEntrega(
      pedidoPlano.direccionEntrega.calle,
      pedidoPlano.direccionEntrega.altura,
      pedidoPlano.direccionEntrega.piso,
      pedidoPlano.direccionEntrega.departamento,
      pedidoPlano.direccionEntrega.codPostal,
      pedidoPlano.direccionEntrega.ciudad,
      pedidoPlano.direccionEntrega.provincia,
      pedidoPlano.direccionEntrega.pais,
      pedidoPlano.direccionEntrega.lat,
      pedidoPlano.direccionEntrega.lon
    );

    const pedido = new Pedido(
      pedidoPlano.compradorId,
      pedidoPlano.items.map(i => new ItemPedido(i.productoId, i.cantidad, i.precioUnitario)),
      pedidoPlano.moneda,
      direccionEntregaInstancia
    );
    pedido.id = pedidoPlano.id;
    pedido.estado = pedidoPlano.estado;
    pedido.historialEstados = pedidoPlano.historialEstados;

    // Aumentar total vendido
    for (const item of pedido.items) {
      await this.productoService.aumentarCantidadVentas(item.productoId, item.cantidad);
    }

    return await this.actualizarEstadoPedido(pedido.id, pedido.estado, vendedorId, "Pedido marcado como enviado");
  }
}