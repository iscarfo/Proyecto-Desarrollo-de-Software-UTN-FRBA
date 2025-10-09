import { EstadoPedido } from "../pedido/enums.js";
import { Notificacion } from "./Notificacion.js";

export class FactoryNotificacion {
  
  static crearNotificacion(pedido, estado) {
    try {
      switch (estado) {
        case EstadoPedido.CONFIRMADO:
          return this.crearNotificacionConfirmado(pedido);
          break;
        case EstadoPedido.ENVIADO:
          return this.crearNotificacionEnviado(pedido);
          break;
        case EstadoPedido.CANCELADO:
          return this.crearNotificacionCancelado(pedido);
          break;
        default:
          throw new Error("Estado desconocido para notificación");
      }
    } catch (error) {
      throw new Error(`Error al crear notificación: ${error.message}`);
    }
  }

  static crearNotificacionConfirmado(pedido) {
    const notificaciones = [];

    //MENSAJE A COMPRADOR
    notificaciones.push(
      new Notificacion(
        pedido.compradorId, //destinatarioId

        `Felicidades, tu pedido ha sido confirmado! Te avisaremos cuando esté en camino.`
      )
    );

    //MENSAJE A VENDEDORES
    for (const vendedor of pedido.obtenerVendedores()) {
      notificaciones.push(
        new Notificacion(
          vendedor.id,
          `Se ha confirmado un pedido con los productos: Recuerda preparar el envío.`
        )
      );
    }
    return notificaciones;
  }

  static crearNotificacionCancelado() {
    const notificaciones = [];


    notificaciones.push(
      new Notificacion(
        pedido.compradorId,
        `Tu pedido ha sido cancelado.`
      )
    );

    for (const vendedor of pedido.obtenerVendedores()) {
      notificaciones.push(
        new Notificacion(
          vendedor.id,
          `El pedido fue cancelado por el comprador.`
        )
      );
    }
    return notificaciones;
  }

  static crearNotificacionEnviado() {
    const notificaciones = [];

    notificaciones.push(
      new Notificacion(
        null,
        pedido.compradorId,
        `Tu pedido ha sido enviado.`
      )
    );

    for (const vendedor of pedido.obtenerVendedores()) {
      notificaciones.push(
        new Notificacion(
          null,
          vendedor,
          `El pedido ha sido marcado como enviado.`
        )
      );
    }
  }

  /*
  // Notificación de pedido confirmado para el cliente
  static async crearNotificacionConfirmado(pedido) {
    const notificaciones = [];
    const productosCantidad = pedido.getItems().map((item) => item.getCantidad());
    const productos = await this.obtenerProductosPedido(pedido);

    //Notificación para el comprador
    const mensaje = `Felicidades, tu pedido ha sido confirmado: ${this.obtenerProductosxCantidad(productos, productosCantidad).join("\n")} Te avisaremos cuando esté en camino.`;
    notificaciones.push(this.crearInstanciaNotificacion(pedido.compradorId, mensaje));

    // Agrupar productos por vendedor
    const vendedores = new Set(productos.map((producto) => producto.vendedor));
    for (const vendedor of vendedores) {
      const productosVendedores = [];
      const productosCantidadVendedores = [];
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].vendedor === vendedor) {
          productosVendedores.push(productos[i]);
          productosCantidadVendedores.push(productosCantidad[i]);
          const mensaje = `Se ha confirmado un pedido con los productos: ${this.obtenerProductosxCantidad(productosVendedores, productosCantidadVendedores).join("\n")} Recuerda preparar el envío.`;
          notificaciones.push(this.crearInstanciaNotificacion(vendedor, mensaje));
        }
      }
    }

    await this.guardarNotificaciones(notificaciones);
  }


  static async crearNotificacionCancelado(pedido) {
    const notificaciones = [];
    const productosCantidad = pedido.getItems().map((item) => item.getCantidad());
    const productos = await this.obtenerProductosPedido(pedido);
    const mensaje = `Tu pedido con los siguientes productos ha sido cancelado:\n\n${this.obtenerProductosxCantidad(productos, productosCantidad).join("\n")}\n\n`;
    notificaciones.push(this.crearInstanciaNotificacion(pedido.compradorId, mensaje));

    const vendedores = new Set(productos.map((producto) => producto.vendedor));
    console.log(productos)
    for (const vendedor of vendedores) {
      const productosVendedores = [];
      const productosCantidadVendedores = [];
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].vendedor === vendedor) {
          productosVendedores.push(productos[i]);
          productosCantidadVendedores.push(productosCantidad[i]);
          const mensaje = `El pedido con los siguientes productos ha sido cancelado:\n\n${this.obtenerProductosxCantidad(productosVendedores, productosCantidadVendedores).join("\n")}\n\n`;
          notificaciones.push(this.crearInstanciaNotificacion(vendedor, mensaje));
        }
      }
    }

    await this.guardarNotificaciones(notificaciones);
  }

  static async crearNotificacionEnviado(pedido) {
    const notificaciones = [];
    const mensajeCliente = `Tu pedido ha sido enviado y está en camino. Pronto lo recibirás en la dirección indicada en el pedido`;
    notificaciones.push(this.crearInstanciaNotificacion(pedido.compradorId, mensajeCliente));
    const productosCantidad = pedido.getItems().map((item) => item.getCantidad());
    const productos = await this.obtenerProductosPedido(pedido);
    const vendedores = new Set(productos.map((producto) => producto.vendedor));
    for (const vendedor of vendedores) {
      const productosVendedores = [];
      const productosCantidadVendedores = [];
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].vendedor === vendedor) {
          productosVendedores.push(productos[i]);
          productosCantidadVendedores.push(productosCantidad[i]);
          const mensaje = `El pedido con los siguientes productos ha sido enviado al cliente:\n\n${this.obtenerProductosxCantidad(productosVendedores, productosCantidadVendedores).join("\n")}\n\nRecuerda hacer el seguimiento del envío.`;
          notificaciones.push(this.crearInstanciaNotificacion(vendedor, mensaje));
        }
      }
    }

    await this.guardarNotificaciones(notificaciones);
  }*/


  static crearSegunEstadoPedido(estadoPedido) {
    return `El pedido pasó al estado: ${estadoPedido}`;
  }

  static crearInstanciaNotificacion(usuarioDestinoId, mensaje) {
    return new Notificacion(null, usuarioDestinoId, mensaje);
  }

  /*
  static async guardarNotificaciones(notificaciones) {
    for (const notificacion of notificaciones) {
      await this.repoNotificaciones.save(notificacion);
    }
  }

  static async obtenerProductosPedido(pedido) {
    const items = pedido.getItems();
    const productosPromesas = items.map(item => this.repoProducto.findById(item.getProductoId()));
    const productos = await Promise.all(productosPromesas);
    return productos;
  }*/

  static obtenerProductosxCantidad(productos, cantidades) {
    const productosStr = [];
    for (let i = 0; i < productos.length; i++) {
      productosStr.push(`${productos[i].titulo} (x${cantidades[i]})`);
    }
    return productosStr;
  }
}