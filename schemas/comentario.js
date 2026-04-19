const mongoose = require('mongoose');
const { Schema } = mongoose;

const adjuntoSchema = new Schema(
  {
    nombre_original: { type: String, required: true },
    url: { type: String, required: true },
    tipo: { type: String, required: true },
    tamaño: { type: Number, required: true },
  },
  { _id: false }
);

const comentarioSchema = new Schema(
  {
    descripcion: {
      type: String,
      required: true,
    },
    asunto: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ['Comentario','Anuncio'],
      required: true
    },
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    usuarioLigado: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false,
    },
    adjuntos: {
      type: [adjuntoSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Comentario = mongoose.model('Comentario', comentarioSchema);
module.exports = Comentario;