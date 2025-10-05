export class ItemPedido {
  //producto
  productoId
  cantidad
  precioUnitario

  constructor(productoId, cantidad, precioUnitario) {
    this.productoId = productoId;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
  }

  subTotal() {
    return this.cantidad * this.precioUnitario;
  }

  getProductoId() {
    return this.productoId;
  }

  getCantidad() {
    return this.cantidad;
  }

  getProducto() {
    return this.productoId;
  }

  // No usados pero los agrego para futuras funcionalidades:
  getPrecioUnitario() { return this.precioUnitario; }
}
