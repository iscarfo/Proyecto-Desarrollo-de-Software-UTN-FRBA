import { EstadoPedido } from "./enums.js";
import { FactoryNotificacion } from "../notificacion/FactoryNotificacion.js";
import { CambioEstadoPedido } from "./CambioEstadoPedido.js";
import { PedidoRepository } from "../../repositories/pedidoRepository.js";

export class Pedido {
  id
  compradorId
  items
  moneda
  direccionEntrega
  estado
  fechaCreacion
  historialEstados

  constructor(compradorId, items, moneda, direccionEntrega) {
    this.id = null; // Se asigna al guardar en BD
    this.compradorId = compradorId; // Id de usuario
    this.items = Array.isArray(items) ? items : []; // [ItemPedido]
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega; // DireccionEntrega
    this.estado = EstadoPedido.PENDIENTE;
    this.fechaCreacion = new Date();
    this.historialEstados = [];
  }

  calcularTotal() {
    return this.items.reduce((acc, item) => acc + item.subTotal(), 0);
  }

  async actualizarEstado(nuevoEstado, quien, motivo, pedidoRepository) {
    // No permitir cancelar un pedido ya cancelado
    if (this.estado === EstadoPedido.CANCELADO && nuevoEstado === EstadoPedido.CANCELADO) {
      throw new Error("El pedido ya fue cancelado previamente.");
    }
    const cambio = new CambioEstadoPedido(
      new Date(),
      nuevoEstado,
      this,
      quien,
      motivo,
    );
    this.historialEstados.push(cambio);
    this.estado = nuevoEstado;

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

    // Actualiza en la base de datos
    const pedidoActualizado = await pedidoRepository.findByIdAndUpdateEstado(
      this.id,
      nuevoEstado,
      quien,
      motivo
    );
    return pedidoActualizado;
  }


  async validarStock(productoRepository) {
  for (const item of this.items) {
    const producto = await productoRepository.findById(item.productoId);
    if (!producto || producto.stock < item.cantidad) {
      return false; // No hay suficiente stock para este producto
    }
  }
  return true; 
}

/*
  obtenerVendedores() {
    const vendedores = new Set();
    this.items.forEach((item) => {
      vendedores.add(item.getProductoId().getVendedor());
    });
    return Array.from(vendedores);
  }*/ // TODO: dejo comentada esta validacion 
  
  obtenerVendedores() {
    // Placeholder temporal: no hay productos persistidos todavía
    return [];
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

  getCompradorId() {
    return this.compradorId;
  }

  getItems() {
    return this.items;
  }

  getDireccionEntrega() {
    return this.direccionEntrega;
  }

  getId() {
    return this.id;
  }

  // No usados pero los agrego para futuras funcionalidades:
  getMoneda() { return this.moneda; }
  getEstado() { return this.estado; }
  getFechaCreacion() { return this.fechaCreacion; }
  getHistorialEstados() { return this.historialEstados; }

  toJSONResumen() {
    return {
      id: this.id,
      items: Array.isArray(this.items) ? this.items.map(item => ({
        productoId: item.productoId || item.getProductoId(),
        cantidad: item.cantidad || item.getCantidad(),
        precioUnitario: item.precioUnitario || item.getPrecioUnitario()
      })) : [],
      estado: this.estado,
      direccionEntrega: {
        calle: this.direccionEntrega.calle,
        altura: this.direccionEntrega.altura,
        piso: this.direccionEntrega.piso,
        departamento: this.direccionEntrega.departamento,
        codPostal: this.direccionEntrega.codPostal,
        ciudad: this.direccionEntrega.ciudad,
        provincia: this.direccionEntrega.provincia,
        pais: this.direccionEntrega.pais
      },
      compradorId: this.compradorId,
      fechaCreacion: this.fechaCreacion,
      total: this.calcularTotal()
    };
  }
}
