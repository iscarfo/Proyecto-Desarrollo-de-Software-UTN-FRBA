export class ItemPedido {
  #producto
  #cantidad
  #precioUnitario

  constructor(producto, cantidad, precioUnitario) {
    this.#producto = producto;
    this.#cantidad = cantidad;
    this.#precioUnitario = precioUnitario;
  }

  subTotal() {
    return this.#cantidad * this.#precioUnitario;
  }

  getProducto() {
    return this.#producto;
  }

  getCantidad() {
    return this.#cantidad;
  }

  // No usados pero los agrego para futuras funcionalidades:
  getPrecioUnitario() { return this.#precioUnitario; }
}