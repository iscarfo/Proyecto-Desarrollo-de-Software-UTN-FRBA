import { clerk } from '../middleware/auth.js';

export class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
  }

  registrarUsuario = async (req, res) => {
    try {
      const { email, nombre, telefono, direccion, tipoUsuario } = req.body;
      const clerkUserId = req.clerkUserId;

      if (!email || !nombre || !telefono || !direccion || !tipoUsuario) {
        return res.status(400).json({
          error: 'Datos incompletos',
          message: 'Todos los campos son requeridos: email, nombre, telefono, direccion, tipoUsuario'
        });
      }

      if (!['comprador', 'vendedor'].includes(tipoUsuario)) {
        return res.status(400).json({
          error: 'Tipo de usuario inválido',
          message: 'El tipoUsuario debe ser "comprador" o "vendedor"'
        });
      }

      const usuario = await this.usuarioService.registrarUsuario({
        email,
        nombre,
        telefono,
        direccion,
        tipoUsuario
      });

      await clerk.users.updateUserMetadata(clerkUserId, {
        publicMetadata: {
          usuarioId: usuario._id.toString(),
          tipoUsuario: tipoUsuario
        }
      });

      return res.status(201).json({
        message: 'Usuario registrado exitosamente',
        usuario: {
          id: usuario._id,
          email: usuario.email,
          nombre: usuario.nombre,
          tipoUsuario: usuario.tipoUsuario
        }
      });
    } catch (error) {
      console.error('Error en registrarUsuario:', error);

      if (error.message === 'Ya existe un usuario con ese email') {
        return res.status(409).json({
          error: 'Conflicto',
          message: error.message
        });
      }

      return res.status(500).json({
        error: 'Error interno',
        message: 'Error al registrar usuario'
      });
    }
  };
}
