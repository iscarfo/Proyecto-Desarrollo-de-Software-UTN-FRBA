import { Notificacion } from "./Notificacion.js";

export class FactoryNotificacion {
  static crearSegunEstadoPedido(estadoPedido) {
    return `El pedido pasó al estado: ${estadoPedido}`;
  }

  static crearSegunPedido(pedido) {
    return new Notificacion(
      Date.now().toString(),
      pedido.getComprador(),
      `Pedido realizado por ${pedido.getComprador().getNombre()}, total: ${pedido.calcularTotal()}, entrega en: ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}`,
      new Date(),
    );
  }

  static crearNotificacionNuevoPedido(pedido, vendedor) {
    const productos = pedido.getItems()
      .filter((item) => item.getProducto().getVendedor().getId() === vendedor.getId())
      .map((item) => `${item.getProducto().getTitulo()} (x${item.getCantidad()})`)
      .join(", ");

    const mensaje = `Nuevo pedido de ${pedido.getComprador().getNombre()}. Productos: ${productos}. Total: ${pedido.calcularTotal()}. Entrega en: ${pedido.getDireccionEntrega().getCalle()} ${pedido.getDireccionEntrega().getAltura()}.`;

    return new Notificacion(
      Date.now().toString(),
      vendedor,
      mensaje,
      new Date(),
    );
  }

  static crearNotificacionEnvio(pedido) {
    const mensaje = `Tu pedido #${pedido.getId()} ha sido enviado y está en camino.`;

    return new Notificacion(
      Date.now().toString(),
      pedido.getComprador(),
      mensaje,
      new Date(),
    );
  }

  static crearNotificacionCancelacion(pedido, vendedor) {
    const productos = pedido.getItems()
      .filter((item) => item.getProducto().getVendedor().getId() === vendedor.getId())
      .map((item) => `${item.getProducto().getTitulo()} (x${item.getCantidad()})`)
      .join(", ");

    const mensaje = `El pedido #${pedido.getId()} con productos ${productos} ha sido cancelado por el comprador ${pedido.getComprador().getNombre()}.`;

    return new Notificacion(
      Date.now().toString(),
      vendedor,
      mensaje,
      new Date(),
    );
  }
}
