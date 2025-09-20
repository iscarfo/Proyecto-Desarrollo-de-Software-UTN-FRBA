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
    // No permitir cancelar un pedido ya cancelado
    if (this.#estado === EstadoPedido.CANCELADO && nuevoEstado === EstadoPedido.CANCELADO) {
      throw new Error("El pedido ya fue cancelado previamente.");
    }
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
    const vendedores = new Set();
    this.#items.forEach((item) => {
      vendedores.add(item.getProducto().getVendedor());
    });
    return Array.from(vendedores);
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

  toJSONResumen() {
    return {
      id: this.#id,
      items: this.#items.map(item => ({
        producto: {
          id: item.getProducto().getId(),
          titulo: item.getProducto().getTitulo(),
          vendedor: {
            id: item.getProducto().getVendedor().getId(),
            nombre: item.getProducto().getVendedor().getNombre(),
            email: item.getProducto().getVendedor().getEmail(),
            telefono: item.getProducto().getVendedor().getTelefono(),
            tipoUsuario: item.getProducto().getVendedor().getTipoUsuario()
          }
        },
        cantidad: item.getCantidad(),
        precioUnitario: item.getPrecioUnitario()
      })),
      estado: this.#estado,
      direccionEntrega: {
        calle: this.#direccionEntrega.getCalle(),
        altura: this.#direccionEntrega.getAltura(),
        piso: this.#direccionEntrega.getPiso(),
        departamento: this.#direccionEntrega.getDepartamento(),
        codPostal: this.#direccionEntrega.getCodPostal(),
        ciudad: this.#direccionEntrega.getCiudad(),
        provincia: this.#direccionEntrega.getProvincia(),
        pais: this.#direccionEntrega.getPais()
      },
      comprador: {
        id: this.#comprador.getId(),
        nombre: this.#comprador.getNombre(),
        email: this.#comprador.getEmail(),
        telefono: this.#comprador.getTelefono(),
        tipoUsuario: this.#comprador.getTipoUsuario()
      },
      fechaCreacion: this.#fechaCreacion,
      total: this.calcularTotal()
    };
  }
}


