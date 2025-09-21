export class DireccionEntrega {
  #calle
  #altura
  #piso
  #departamento
  #codPostal
  #ciudad
  #provincia
  #pais
  #lat
  #lon


  constructor(
    calle,
    altura,
    piso,
    departamento,
    codPostal,
    ciudad,
    provincia,
    pais,
    lat,
    lon,
  ) {
    this.#calle = calle;
    this.#altura = altura;
    this.#piso = piso;
    this.#departamento = departamento;
    this.#codPostal = codPostal;
    this.#ciudad = ciudad;
    this.#provincia = provincia;
    this.#pais = pais;
    this.#lat = lat;
    this.#lon = lon;
  }

  getCalle() {
    return this.#calle;
  }

  getAltura() {
    return this.#altura;
  }

  // No usados pero los agrego para futuras funcionalidades:
  getPiso() { return this.#piso; }
  getDepartamento() { return this.#departamento; }
  getCodPostal() { return this.#codPostal; }
  getCiudad() { return this.#ciudad; }
  getProvincia() { return this.#provincia; }
  getPais() { return this.#pais; }
  getLat() { return this.#lat; }
  getLon() { return this.#lon; }
}
