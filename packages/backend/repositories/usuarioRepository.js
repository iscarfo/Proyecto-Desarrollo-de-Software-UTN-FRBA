import { Usuario } from '../models/Usuario.js';

export class UsuarioRepository {

  async findById(id) {
    try {
      return await Usuario.findById(id).lean();
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      return await Usuario.findOne({ email }).lean();
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  async save(usuario) {
    try {
      if (usuario._id) {
        // Actualizar usuario existente
        return await Usuario.findByIdAndUpdate(
          usuario._id,
          usuario,
          { new: true, lean: true }
        );
      } else {
        // Crear nuevo usuario
        const nuevoUsuario = new Usuario(usuario);
        return await nuevoUsuario.save();
      }
    } catch (error) {
      throw new Error(`Error al guardar usuario: ${error.message}`);
    }
  }

  async create(usuarioData) {
    try {
      const usuario = new Usuario(usuarioData);
      return await usuario.save();
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [usuarios, total] = await Promise.all([
        Usuario.find({ activo: true })
          .skip(skip)
          .limit(limit)
          .lean(),
        Usuario.countDocuments({ activo: true })
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        pagina: page,
        perPage: limit,
        totalColecciones: total,
        totalPaginas: totalPages,
        data: usuarios
      };
    } catch (error) {
      throw new Error(`Error al listar usuarios: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      // Soft delete - marcar como inactivo
      return await Usuario.findByIdAndUpdate(
        id,
        { activo: false },
        { new: true, lean: true }
      );
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }
}
