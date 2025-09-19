export class FactoryNotificacion {
  static crearSegunEstadoPedido(estadoPedido) {
    return `El pedido pasó al estado: ${estadoPedido}`;
  }

  // Notificación de pedido confirmado para el cliente
  static crearNotificacionConfirmadoCliente(pedido) {
    const productos = pedido.getItems()
      .map((item) => `${item.getProducto().getTitulo()} (x${item.getCantidad()})`)
      .join("\n");
    const mensaje = `Felicidades, tu pedido ha sido confirmado:\n\n${productos}\n\nTe avisaremos cuando esté en camino.`;
    return new Notificacion(
      Date.now().toString(),
      pedido.getComprador(),
      mensaje,
      new Date(),
    );
  }

  // Notificación de pedido confirmado para el vendedor
  static crearNotificacionConfirmadoVendedor(pedido, vendedor) {
    const productos = pedido.getItems()
      .filter((item) => item.getProducto().getVendedor().getId() === vendedor.getId())
      .map((item) => `${item.getProducto().getTitulo()} (x${item.getCantidad()})`)
      .join("\n");
    const mensaje = `Se ha confirmado un pedido con tus productos:\n\n${productos}\n\nRecuerda preparar el envío.`;
    return new Notificacion(
      Date.now().toString(),
      vendedor,
      mensaje,
      new Date(),
    );
  }

  // Notificación de pedido enviado para el cliente
  static crearNotificacionEnviadoCliente(pedido) {
    const direccion = `${pedido.getDireccionEntrega().getCalle()} ${pedido.getDireccionEntrega().getAltura()}`;
    const mensaje = `Tu pedido está en camino hacia la dirección ${direccion}`;
    return new Notificacion(
      Date.now().toString(),
      pedido.getComprador(),
      mensaje,
      new Date(),
    );
  }

  // Notificación de pedido enviado para el vendedor
  static crearNotificacionEnviadoVendedor(pedido, vendedor) {
    const productos = pedido.getItems()
      .filter((item) => item.getProducto().getVendedor().getId() === vendedor.getId())
      .map((item) => `${item.getProducto().getTitulo()} (x${item.getCantidad()})`)
      .join(", ");
    const direccion = `${pedido.getDireccionEntrega().getCalle()} ${pedido.getDireccionEntrega().getAltura()}`;
    const mensaje = `El pedido con tus productos (${productos}) ha sido enviado al cliente. Dirección de entrega: ${direccion}.`;
    return new Notificacion(
      Date.now().toString(),
      vendedor,
      mensaje,
      new Date(),
    );
  }

  // Notificación de pedido cancelado para el cliente
  static crearNotificacionCanceladoCliente(pedido) {
    const productos = pedido.getItems()
      .map((item) => `${item.getProducto().getTitulo()} (x${item.getCantidad()})`)
      .join("\n");
    const mensaje = `Tu pedido con los siguientes productos ha sido cancelado:\n\n${productos}\n\nLamentamos que hayas tenido que cancelar, esperamos tu próxima compra.`;
    return new Notificacion(
      Date.now().toString(),
      pedido.getComprador(),
      mensaje,
      new Date(),
    );
  }

  // Notificación de pedido cancelado para el vendedor
  static crearNotificacionCanceladoVendedor(pedido, vendedor) {
    const productos = pedido.getItems()
      .filter((item) => item.getProducto().getVendedor().getId() === vendedor.getId())
      .map((item) => `${item.getProducto().getTitulo()} (x${item.getCantidad()})`)
      .join("\n");
    const mensaje = `El pedido con los siguientes productos ha sido cancelado por el cliente:\n\n${productos}\n\n`;
    return new Notificacion(
      Date.now().toString(),
      vendedor,
      mensaje,
      new Date(),
    );
  }
}
