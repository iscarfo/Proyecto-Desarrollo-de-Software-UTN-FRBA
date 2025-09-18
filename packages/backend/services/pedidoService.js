import { Pedido } from "../domain/Pedido.js";
import { Producto } from "../domain/Producto.js";
import { ItemPedido } from "../domain/Pedido.js";
import { Usuario } from "../domain/Usuario.js";
import { DireccionEntrega } from "../domain/Pedido.js";

export class PedidoService {
  constructor(pedidoRepository, productoRepository) {
    this.pedidoRepository = pedidoRepository;
    this.productoRepository = productoRepository;
  }

  async crearPedido(comprador, items, moneda, direccionEntrega) {
   // instanciar comprador como Usuario
    const compradorInstancia = new Usuario(
      comprador.id,
      comprador.nombre,
      comprador.email,
      comprador.telefono,
      comprador.tipoUsuario
    );
   
    // Convertir JSON de items a instancias de ItemPedido con Producto correctamente instanciado
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
        Date.now(), 
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

  async listarPedidos() { // para el GET /pedidos
    // Devuelve todos los pedidos guardados
    return this.pedidoRepository.findAll();
  }

  async cancelarPedido(idPedido, comprador) {
  const pedido = await this.pedidoRepository.findById(Number(idPedido));
  if (!pedido) {
      throw new Error("Pedido no encontrado");
  }

  // Validar que quien solicita la cancelación sea el comprador original
  if (pedido.getComprador().getId() !== comprador.id) {
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
}