import mongoose from 'mongoose';
import { Usuario } from '../models/Usuario.js';
import { InvalidIdError, NotFoundError, ConflictError } from '../errors/AppError.js';

export class NotificacionesService {
  constructor(notificacionesRepository) {
    this.notificacionesRepository = notificacionesRepository;
  }

  async obtenerNotificacionesNoLeidas(usuarioId, page = 1, limit = 10) {
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      throw new InvalidIdError('Usuario ID');
    }

    // Verificar que el usuario existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuario', usuarioId);
    }

    // Validar parámetros de paginación siguiendo la convención existente
    const numeroPagina = Math.max(Number(page), 1);
    const elementosXPagina = Math.min(Math.max(Number(limit), 1), 100);

    return await this.notificacionesRepository.findByUsuarioAndLeida(usuarioId, false, numeroPagina, elementosXPagina);
  }

  async obtenerNotificacionesLeidas(usuarioId, page = 1, limit = 10) {
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      throw new InvalidIdError('Usuario ID');
    }

    // Verificar que el usuario existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuario', usuarioId);
    }

    // Validar parámetros de paginación siguiendo la convención existente
    const numeroPagina = Math.max(Number(page), 1);
    const elementosXPagina = Math.min(Math.max(Number(limit), 1), 100);

    return await this.notificacionesRepository.findByUsuarioAndLeida(usuarioId, true, numeroPagina, elementosXPagina);
  }

  async marcarComoLeida(notificacionId) {
    if (!mongoose.Types.ObjectId.isValid(notificacionId)) {
      throw new InvalidIdError('Notificación ID');
    }

    const notificacion = await this.notificacionesRepository.findById(notificacionId);

    if (!notificacion) {
      throw new NotFoundError('Notificación', notificacionId);
    }

    if (notificacion.leida) {
      throw new ConflictError('La notificación ya está marcada como leída');
    }

    const notificacionActualizada = {
      ...notificacion,
      leida: true,
      fechaLectura: new Date()
    };

    return await this.notificacionesRepository.save(notificacionActualizada);
  }

  async crearNotificacion(usuarioId, titulo, mensaje, tipo = 'sistema') {
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      throw new InvalidIdError('Usuario ID');
    }

    // Verificar que el usuario existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      throw new NotFoundError('Usuario', usuarioId);
    }

    const notificacionData = {
      usuarioId,
      titulo,
      mensaje,
      tipo
    };

    return await this.notificacionesRepository.create(notificacionData);
  }
}