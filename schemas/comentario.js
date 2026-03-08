const mongoose = require('mongoose');
const { Schema } = mongoose;

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
  },
  {
    timestamps: true,
  }
);

const Comentario = mongoose.model('Comentario', comentarioSchema);
module.exports = Comentario;