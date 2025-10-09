import { ValidationError } from '../../errors/AppError.js';

export class DireccionEntrega {
  calle
  altura
  piso
  departamento
  codPostal
  ciudad
  provincia
  pais
  lat
  lon

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
    this.calle = calle;
    this.altura = altura;
    this.piso = piso;
    this.departamento = departamento;
    this.codPostal = codPostal;
    this.ciudad = ciudad;
    this.provincia = provincia;
    this.pais = pais;
    this.lat = lat;
    this.lon = lon;

    this.validar();
  }

  validar() {
    // Campos obligatorios
     if (typeof this.calle !== 'string' || !this.calle.trim()) {
      throw new ValidationError('La calle es obligatoria y debe ser un texto válido.', 'calle');
    }

    if (typeof this.altura !== 'number' || Number.isNaN(this.altura) || this.altura <= 0) {
      throw new ValidationError('La altura es obligatoria y debe ser un número mayor a 0.', 'altura');
    }

    if (typeof this.ciudad !== 'string' || !this.ciudad.trim()) {
      throw new ValidationError('La ciudad es obligatoria y debe ser un texto válido.', 'ciudad');
    }

    if (typeof this.provincia !== 'string' || !this.provincia.trim()) {
      throw new ValidationError('La provincia es obligatoria y debe ser un texto válido.', 'provincia');
    }

    if (typeof this.pais !== 'string' || !this.pais.trim()) {
      throw new ValidationError('El país es obligatorio y debe ser un texto válido.', 'pais');
    }

    // Campos opcionales: si existen, validar formato básico
    if (this.codPostal != null && typeof this.codPostal !== 'string') {
      throw new ValidationError('El código postal debe ser un texto.', 'codPostal');
    }

    if (this.piso != null && (typeof this.piso !== 'number' || Number.isNaN(this.piso) || this.piso < 0)) {
      throw new ValidationError('El piso debe ser un número positivo.', 'piso');
    }

    if (this.departamento != null && typeof this.departamento !== 'string') {
      throw new ValidationError('El departamento debe ser texto.', 'departamento');
    }

    if (this.lat != null && (typeof this.lat !== 'number' || Number.isNaN(this.lat) || this.lat < -90 || this.lat > 90)) {
      throw new ValidationError('Latitud fuera de rango (-90 a 90).', 'lat');
    }

    if (this.lon != null && (typeof this.lon !== 'number' || Number.isNaN(this.lon) || this.lon < -180 || this.lon > 180)) {
      throw new ValidationError('Longitud fuera de rango (-180 a 180).', 'lon');
    }
  }

  getCalle() {
    return this.calle;
  }

  getAltura() {
    return this.altura;
  }

  // No usados pero los agrego para futuras funcionalidades:
  getPiso() { return this.piso; }
  getDepartamento() { return this.departamento; }
  getCodPostal() { return this.codPostal; }
  getCiudad() { return this.ciudad; }
  getProvincia() { return this.provincia; }
  getPais() { return this.pais; }
  getLat() { return this.lat; }
  getLon() { return this.lon; }
}
