import { EstadoPedido } from "./enums.js";
import { FactoryNotificacion } from "../notificacion/FactoryNotificacion.js";
import { CambioEstadoPedido } from "./CambioEstadoPedido.js";

export class Pedido {
  #id
  #comprador
  #items
  #moneda
  #direccionEntrega
  #estado
  #fechaCreacion
  #historialEstados

  constructor(id, comprador, items, moneda, direccionEntrega) {
    this.#id = id;
    this.#comprador = comprador; // Usuario
    this.#items = items || []; // [ItemPedido]
    this.#moneda = moneda;
    this.#direccionEntrega = direccionEntrega; // DireccionEntrega
    this.#estado = EstadoPedido.PENDIENTE;
    this.#fechaCreacion = new Date();
    this.#historialEstados = [];
  }

  calcularTotal() {
    return this.#items.reduce((acc, item) => acc + item.subTotal(), 0);
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    const cambio = new CambioEstadoPedido(
      new Date(),
      nuevoEstado,
      this,
      quien,
      motivo,
    );
    this.#historialEstados.push(cambio);
    this.#estado = nuevoEstado;

    if (nuevoEstado === EstadoPedido.ENVIADO) {
      const notificacion = FactoryNotificacion.crearNotificacionEnvio(this);
    }

    if (nuevoEstado === EstadoPedido.CANCELADO) {
      const vendedores = this.obtenerVendedores();
      vendedores.forEach((vendedor) => {
        const notificacion = FactoryNotificacion.crearNotificacionCancelacion(
          this,
          vendedor,
        );
      });
    }
  }

  validarStock() {
    return this.#items.every((item) =>
      item.getProducto().estaDisponible(item.getCantidad()),
    );
  }

  obtenerVendedores() {
    return [...new Set(
      this.#items.map(item => item.getProducto().getVendedor())
    )];
  }

  crearPedido() {
    const vendedores = this.obtenerVendedores();
    vendedores.forEach((vendedor) => {
      const notificacion = FactoryNotificacion.crearNotificacionNuevoPedido(
        this,
        vendedor,
      );
    });
  }

  getComprador() {
    return this.#comprador;
  }

  getItems() {
    return this.#items;
  }

  getDireccionEntrega() {
    return this.#direccionEntrega;
  }

  getId() {
    return this.#id;
  }

  // No usados pero los agrego para futuras funcionalidades:
  getMoneda() { return this.#moneda; }
  getEstado() { return this.#estado; }
  getFechaCreacion() { return this.#fechaCreacion; }
  getHistorialEstados() { return this.#historialEstados; }
}