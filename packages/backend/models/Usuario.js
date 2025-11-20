import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  telefono: {
    type: String,
    trim: true
  },
  direccion: {
    calle: {
      type: String,
      trim: true
    },
    ciudad: {
      type: String,
      trim: true
    },
    codigoPostal: {
      type: String,
      trim: true
    }
  },
  tipoUsuario: {
    type: String,
    enum: ['comprador', 'vendedor'],
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices para optimizar consultas
usuarioSchema.index({ activo: 1 });

export const Usuario = mongoose.model('Usuario', usuarioSchema);