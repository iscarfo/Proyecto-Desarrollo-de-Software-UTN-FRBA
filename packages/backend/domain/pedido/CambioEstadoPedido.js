export class CambioEstadoPedido {
  #fecha
  #estado
  #pedido
  #usuario
  #motivo

  constructor(fecha, estado, pedido, usuario, motivo) {
    this.#fecha = fecha;
    this.#estado = estado;
    this.#pedido = pedido;
    this.#usuario = usuario;
    this.#motivo = motivo;
  }

  // Getters si es necesario
  getFecha() { return this.#fecha; }
  getEstado() { return this.#estado; }
  getPedido() { return this.#pedido; }
  getUsuario() { return this.#usuario; }
  getMotivo() { return this.#motivo; }
}