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
          vendedor._id,
          `Se ha confirmado un pedido con los productos: Recuerda preparar el envío.`
        )
      );
    }
    return notificaciones;
  }

  static crearNotificacionCancelado(pedido) {
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
          vendedor._id,
          `El pedido fue cancelado por el comprador.`
        )
      );
    }
    return notificaciones;
  }

  static crearNotificacionEnviado(pedido) {
    const notificaciones = [];

    notificaciones.push(
      new Notificacion(
        pedido.compradorId,
        `Tu pedido ha sido enviado.`
      )
    );

    for (const vendedor of pedido.obtenerVendedores()) {
      notificaciones.push(
        new Notificacion(
          vendedor._id,
          `El pedido ha sido marcado como enviado.`
        )
      );
    }

    return notificaciones; 
  }

  static crearSegunEstadoPedido(estadoPedido) {
    return `El pedido pasó al estado: ${estadoPedido}`;
  }

  static crearInstanciaNotificacion(usuarioDestinoId, mensaje) {
    return new Notificacion(null, usuarioDestinoId, mensaje);
  }

  static obtenerProductosxCantidad(productos, cantidades) {
    const productosStr = [];
    for (let i = 0; i < productos.length; i++) {
      productosStr.push(`${productos[i].titulo} (x${cantidades[i]})`);
    }
    return productosStr;
  }
}