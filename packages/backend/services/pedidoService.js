import { Pedido } from "../domain/pedido/Pedido.js";
import { ItemPedido } from "../domain/pedido/ItemPedido.js";
import { DireccionEntrega } from "../domain/pedido/DireccionEntrega.js";

export class PedidoService {
  constructor(pedidoRepository, productoRepository) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
  }

  // Crear un nuevo pedido
  async crearPedido(compradorId, items, moneda, direccionEntrega) {

    const itemsInstancia = items.map(item =>
      new ItemPedido(
        item.productoId, // ← Cambiado para que use productoId en vez de un objeto Producto
        item.cantidad,
        item.precioUnitario
      )
    );

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

    const pedido = new Pedido(
      compradorId,
      itemsInstancia,
      moneda,
      direccionEntregaInstancia
    );

    if (!pedido.validarStock()) {
      throw new Error("Stock insuficiente para uno o más productos");
    }

    pedido.crearPedido(); // notifica a vendedores
    return this.pedidoRepository.save(pedido);
  }

  // Listar todos los pedidos
  async listarPedidos() {
    return this.pedidoRepository.findAll();
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

    const pedido = new Pedido(
      pedidoPlano.compradorId,
      pedidoPlano.items.map(i => new ItemPedido(i.productoId, i.cantidad, i.precioUnitario)),
      pedidoPlano.moneda,
      pedidoPlano.direccionEntrega
    );
    pedido.id = pedidoPlano.id;
    pedido.estado = pedidoPlano.estado;
    pedido.historialEstados = pedidoPlano.historialEstados;

    return await pedido.actualizarEstado("CANCELADO", compradorId, "Cancelación por el usuario", this.pedidoRepository);
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

    const pedido = new Pedido(
      pedidoPlano.compradorId,
      pedidoPlano.items.map(i => new ItemPedido(i.productoId, i.cantidad, i.precioUnitario)),
      pedidoPlano.moneda,
      pedidoPlano.direccionEntrega
    );
    pedido.id = pedidoPlano.id;
    pedido.estado = pedidoPlano.estado;
    pedido.historialEstados = pedidoPlano.historialEstados;

    return await pedido.actualizarEstado("ENVIADO", vendedorId, "Pedido marcado como enviado", this.pedidoRepository);
  }
}