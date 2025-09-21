import mongoose from 'mongoose';

const notificacionSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario',
    index: true
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  mensaje: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['pedido', 'producto', 'envio', 'sistema'],
    default: 'sistema'
  },
  leida: {
    type: Boolean,
    required: true,
    default: false,
    index: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaLectura: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índice compuesto para consultas frecuentes
notificacionSchema.index({ usuarioId: 1, leida: 1 });
notificacionSchema.index({ usuarioId: 1, fechaCreacion: -1 });

export const Notificacion = mongoose.model('Notificacion', notificacionSchema);