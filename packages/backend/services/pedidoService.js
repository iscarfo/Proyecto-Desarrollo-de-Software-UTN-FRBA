import { Pedido } from "../domain/pedido/Pedido.js";
import { Producto } from "../domain/producto/Producto.js";
import { ItemPedido } from "../domain/pedido/ItemPedido.js";
import { DireccionEntrega } from "../domain/pedido/DireccionEntrega.js";
import { Usuario } from "../domain/usuario/Usuario.js";

export class PedidoService {
  constructor(pedidoRepository, productoRepository) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
  }

  // Crear un nuevo pedido
  async crearPedido(comprador, items, moneda, direccionEntrega) {
    const compradorInstancia = new Usuario(
      comprador.id,
      comprador.nombre,
      comprador.email,
      comprador.telefono,
      comprador.tipoUsuario
    );

    const itemsInstancia = items.map(item =>
      new ItemPedido(
        new Producto(
          item.producto.id,
          new Usuario(
            item.producto.vendedor.id,
            item.producto.vendedor.nombre,
            item.producto.vendedor.email,
            item.producto.vendedor.telefono,
            item.producto.vendedor.tipoUsuario
          ),
          item.producto.titulo,
          item.producto.status,
          item.producto.descripcion,
          item.producto.categorias,
          item.producto.precio,
          item.producto.moneda,
          item.producto.stock,
          item.producto.fotos,
          item.producto.activo
        ),
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
      Date.now().toString(), // ID como string
      compradorInstancia,
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
  async cancelarPedido(idPedido, comprador) {
    const pedido = await this.pedidoRepository.findById(idPedido); 
    if (!pedido) throw new Error("Pedido no encontrado");

    if (Number(pedido.getComprador().getId()) !== Number(comprador.id)) {
    throw new Error("No autorizado: solo el comprador puede cancelar su pedido");
}

    if (pedido.getEstado() === "ENVIADO") {
      throw new Error("El pedido ya fue enviado y no puede cancelarse");
    } else if (pedido.getEstado() === "CANCELADO") {
      throw new Error("El pedido fue anteriormente cancelado");
    }

    pedido.actualizarEstado("CANCELADO", comprador, "Cancelación por el usuario");
    return this.pedidoRepository.save(pedido);
  }

  // Obtener pedidos de un usuario
  /*
  async obtenerPedidosDeUsuario(usuarioId) {
    return this.pedidoRepository.findAll().filter(
      p => p.getComprador().getId().toString() === usuarioId.toString()
    );
  }*/

  async obtenerPedidosDeUsuario(usuarioId) {
  const todos = await this.pedidoRepository.findAll(); // ← faltaba el await
  return todos.filter(
    p => p.getComprador().getId().toString() === usuarioId.toString()
  );
}


  // Marcar pedido como enviado
  async marcarComoEnviado(pedidoId, vendedor) {
    const pedido = await this.pedidoRepository.findById(pedidoId); // <-- string
    if (!pedido) throw new Error("Pedido no encontrado");

    const vendedoresIds = pedido.getItems().map(
      i => i.getProducto().getVendedor().getId().toString()
    );

    if (!vendedoresIds.includes(vendedor.id.toString())) {
      throw new Error("No autorizado para marcar este pedido como enviado");
    }

    pedido.actualizarEstado("ENVIADO", vendedor, "Pedido marcado como enviado");
    return this.pedidoRepository.save(pedido);
  }
}