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

