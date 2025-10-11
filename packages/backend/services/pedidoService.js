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
    const itemsInstancia = await Promise.all(
      items.map(async (item) => {
        const precio = await this.productoService.buscarPrecioUnitario(item.productoId);
        return new ItemPedido(
            item.productoId, 
            item.cantidad, 
            precio);
      })
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
    const pedidoCreado = await this.pedidoRepository.create(pedido);

    //Despachar notificaciones tras creación del pedido (asincrónico)
    await this.notificacionesService
      .despacharPorEstado(pedido, EstadoPedido.CONFIRMADO)
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

    const pedidoDB = await this.pedidoRepository.findById(pedidoId);
    if (!pedidoDB) {
      throw new NotFoundError('Pedido', pedidoId);
    }

    // reconstruir instancia del dominio
    const pedido = rehidratarPedido(pedidoDB);

    // No permitir cancelar un pedido ya cancelado
    if (pedido.estado === EstadoPedido.CANCELADO && nuevoEstado === EstadoPedido.CANCELADO) {
      throw new Error("El pedido ya fue cancelado previamente.");
    }

    //Notificaciones por cambio de estado
    await this.notificacionesService.despacharPorEstado(pedido, nuevoEstado);

    //Actualizar pedido en BD
    return await this.pedidoRepository.findByIdAndUpdateEstado(pedidoId, nuevoEstado, quien, motivo);
  }

  // Cancelar pedido
  async cancelarPedido(pedidoId, compradorId) {
    const pedido = await this.pedidoRepository.findById(pedidoId);
    if (!pedido) throw new NotFoundError('Pedido', pedidoId);

    if (pedido.compradorId.toString() !== compradorId.toString()) {
      throw new Error("No autorizado: solo el comprador puede cancelar su pedido");
    }

    if (pedido.estado === "ENVIADO") {
      throw new Error("El pedido ya fue enviado y no puede cancelarse");
    } else if (pedido.estado === "CANCELADO") {
      throw new Error("El pedido fue anteriormente cancelado");
    }

    //SI SE CANCELA EL PEDIDO, EL VENDEDOR RECUPERA EL STOCK (AUMENTAR STOCK)
    for (const item of pedido.items) {
      await this.productoService.aumentarStock(item.productoId, item.cantidad);
    }

    return await this.actualizarEstadoPedido(pedido._id, EstadoPedido.CANCELADO, compradorId, "Cancelación por el usuario");
  }

  // Obtener pedidos de un usuario
  async obtenerPedidosDeUsuario(usuarioId) {
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      throw new InvalidIdError('Usuario ID');
    }

    const pedidos = await this.pedidoRepository.findByCompradorId(usuarioId);
    return pedidos;
  }

  // Marcar pedido como enviado
  async marcarComoEnviado(pedidoId, vendedorId) {
    const pedido = await this.pedidoRepository.findById(pedidoId);
    if (!pedido) throw new NotFoundError('Pedido', pedidoId);

    // Validar que el vendedor esté en los productos de los items del pedido
    // Si el pedido tiene productos de múltiples vendedores,
    // obligás a que todos sean del vendedor actual.

    if (pedido.estado === "ENVIADO") {
      throw new Error("El pedido ya fue enviado");
    } else if (pedido.estado === "CANCELADO") {
      throw new Error("El pedido fue cancelado y no puede enviarse");
    }

    // Aumentar total vendido
    for (const item of pedido.items) {
      await this.productoService.aumentarCantidadVentas(item.productoId, item.cantidad);
    }

    return await this.actualizarEstadoPedido(pedido._id, EstadoPedido.ENVIADO, vendedorId, "Pedido marcado como enviado");
  }

}

function rehidratarPedido(pedidoDb) {

  const items = pedidoDb.items.map(
    i => new ItemPedido(i.productoId, i.cantidad, i.precioUnitario)
  );

  const pedido = new Pedido(
    pedidoDb.compradorId,
    items,
    pedidoDb.moneda,
    pedidoDb.direccionEntrega
  );

  pedido.id = pedidoDb._id;
  pedido.estado = pedidoDb.estado;
  pedido.historialEstados = pedidoDb.historialEstados ?? [];

  return pedido;
}