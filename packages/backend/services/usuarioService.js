export class UsuarioService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async registrarUsuario(datosUsuario) {
    const { email, nombre, telefono, direccion, tipoUsuario } = datosUsuario;

    const usuarioExistente = await this.usuarioRepository.findByEmail(email);
    if (usuarioExistente) {
      throw new Error('Ya existe un usuario con ese email');
    }

    const nuevoUsuario = await this.usuarioRepository.create({
      nombre,
      email,
      telefono,
      direccion,
      tipoUsuario,
      activo: true,
      fechaRegistro: new Date()
    });

    return nuevoUsuario;
  }

  async obtenerUsuarioPorId(id) {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return usuario;
  }

  async obtenerUsuarioPorEmail(email) {
    return await this.usuarioRepository.findByEmail(email);
  }
}
