export class Notificacion {
  #id
  #usuarioDestino
  #mensaje
  #fechaAlta
  #fechaLeida
  #leida

  constructor(id, usuarioDestino, mensaje, fechaAlta) {
    this.#id = id;
    this.#usuarioDestino = usuarioDestino;
    this.#mensaje = mensaje;
    this.#fechaAlta = fechaAlta;
    this.#fechaLeida = null;
    this.#leida = false;
  }

  marcarComoLeida() {
    this.#fechaLeida = new Date();
    this.#leida = true;
  }

  // Getters si es necesario
  getId() { return this.#id; }
  getUsuarioDestino() { return this.#usuarioDestino; }
  getMensaje() { return this.#mensaje; }
  getFechaAlta() { return this.#fechaAlta; }
  getFechaLeida() { return this.#fechaLeida; }
  isLeida() { return this.#leida; }
}

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

// ================= NOTIFICACIONES =================

/*
class Notificacion {
  constructor(id, usuarioDestino, mensaje, fechaAlta) {
    this.id = id;
    this.usuarioDestino = usuarioDestino;
    this.mensaje = mensaje;
    this.fechaAlta = fechaAlta;
    this.fechaLeida = null;
    this.leida = false
  }

  marcarComoLeida() {
    this.fechaLeida = new Date();
    this.leida = true;
  }
}

class FactoryNotificacion {
  static crearSegunPedido(pedido) {
    return new Notificacion(
      Date.now().toString(),
      pedido.comprador,
      this.crearSegunEstadoPedido(pedido),
      new Date()
    );
  }

  static crearSegunEstadoPedido(pedido) {
    switch (pedido.estado) {
      case EstadoPedido.PENDIENTE: return notificarVendedorPedidoCreado(pedido);
      case EstadoPedido.ENVIADO: return notificarCompradorPedidoEnviado(pedido);
      case EstadoPedido.CANCELADO: return notificarVendedorPedidoCancelado(pedido, 'El comprador se arrepintio');
      default: return null;
    }
  }
}

function notificarVendedorPedidoCreado(pedido) {
  // Notifica a cada vendedor involucrado en el pedido
  //const vendedor = pedido.items[0].producto.vendedor;
  const productos = pedido.items
    .map(item => `${item.producto.titulo} x${item.cantidad}`)
    .join(", ");
  const mensaje = `Nuevo pedido realizado por ${pedido.comprador.nombre}. Productos: ${productos}. Total: ${pedido.calcularTotal()}. Entrega en: ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}`;
  return mensaje;
}

function notificarCompradorPedidoEnviado(pedido) {
  const mensaje = `Tu pedido #${pedido.id} ha sido enviado.`;
  return mensaje;
}

function notificarVendedorPedidoCancelado(pedido, motivo) {
  //const vendedor = pedido.items[0].producto.vendedor;
  const mensaje = `El pedido #${pedido.id} fue cancelado por el comprador. Motivo: ${motivo || 'No especificado'}`;
  return mensaje;
}

// TEST DE NOTIFICACIONES 
app.get('/test-notificaciones', (req, res) => {
  // Crear un comprador
  const comprador = new Usuario(1, "Facundo", "facu@mail.com", "123456", TipoUsuario.COMPRADOR);

  // Crear un vendedor
  const vendedor = new Usuario(2, "Juan", "juan@mail.com", "789101", TipoUsuario.VENDEDOR);

  // Crear un vendedor
  const vendedor2 = new Usuario(3, "Pepe", "pepe@mail.com", "789102", TipoUsuario.VENDEDOR);

  // Crear un producto
  const producto = new Producto(1, vendedor, "Pistachos Premium", "DISPONIBLE", "Bolsa de 1kg", [], 5000, Moneda.PESO_ARG, 10, [], true);

  // Crear un producto
  const producto2 = new Producto(2, vendedor2, "zapatillas", "DISPONIBLE", "par de zapas", [], 5000, Moneda.PESO_ARG, 10, [], true);

  // Crear item de pedido
  const item = new ItemPedido(producto, 2, producto.precio);

  // Crear item de pedido
  const item2 = new ItemPedido(producto2, 5, producto2.precio);

  // Dirección de entrega
  const direccion = new DireccionEntrega("Av. Siempre Viva", 742, null, null, "1000", "CABA", "Buenos Aires", "Argentina", -34.6, -58.4);

  // Crear pedido
  const pedido = new Pedido(1, comprador, [item, item2], Moneda.PESO_ARG, direccion);

  // Llamar a las funciones de notificación
  const notif = FactoryNotificacion.crearSegunPedido(pedido);
  pedido.actualizarEstado(EstadoPedido.ENVIADO, vendedor);
  const notif2 = FactoryNotificacion.crearSegunPedido(pedido);
  pedido.actualizarEstado(EstadoPedido.CANCELADO, comprador, "El comprador se arrepintió");
  const notif3 = FactoryNotificacion.crearSegunPedido(pedido);


  //const notif1 = notificarVendedorPedidoCreado(pedido);
  //const notif2 = notificarCompradorPedidoEnviado(pedido);
  //const notif3 = notificarVendedorPedidoCancelado(pedido, "El comprador se arrepintió");

  res.json({ notif, notif2, notif3 });
}); */
