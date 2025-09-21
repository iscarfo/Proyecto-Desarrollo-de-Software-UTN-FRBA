import { Notificacion } from '../models/Notificacion.js';

export class NotificacionesRepository {

  async findByUsuarioAndLeida(usuarioId, leida, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [notificaciones, total] = await Promise.all([
        Notificacion.find({ usuarioId, leida })
          .sort({ fechaCreacion: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Notificacion.countDocuments({ usuarioId, leida })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        pagina: page,
        perPage: limit,
        totalColecciones: total,
        totalPaginas: totalPages,
        data: notificaciones
      };
    } catch (error) {
      throw new Error(`Error al buscar notificaciones: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Notificacion.findById(id).lean();
    } catch (error) {
      throw new Error(`Error al buscar notificación: ${error.message}`);
    }
  }

  async save(notificacion) {
    try {
      if (notificacion._id) {
        // Actualizar notificación existente
        return await Notificacion.findByIdAndUpdate(
          notificacion._id,
          notificacion,
          { new: true, lean: true }
        );
      } else {
        // Crear nueva notificación
        const nuevaNotificacion = new Notificacion(notificacion);
        return await nuevaNotificacion.save();
      }
    } catch (error) {
      throw new Error(`Error al guardar notificación: ${error.message}`);
    }
  }

  async create(notificacionData) {
    try {
      const notificacion = new Notificacion(notificacionData);
      return await notificacion.save();
    } catch (error) {
      throw new Error(`Error al crear notificación: ${error.message}`);
    }
  }

  async findByUsuario(usuarioId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [notificaciones, total] = await Promise.all([
        Notificacion.find({ usuarioId })
          .sort({ fechaCreacion: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Notificacion.countDocuments({ usuarioId })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        pagina: page,
        perPage: limit,
        totalColecciones: total,
        totalPaginas: totalPages,
        data: notificaciones
      };
    } catch (error) {
      throw new Error(`Error al buscar notificaciones del usuario: ${error.message}`);
    }
  }
}