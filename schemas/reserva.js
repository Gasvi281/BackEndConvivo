const mongoose = require('mongoose');
const { Schema } = mongoose;

const reservaSchema = new Schema(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    espacioId: {
      type: Schema.Types.ObjectId,
      ref: 'Espacio',
      required: true,
    },
    fecha: {
      type: String,
      required: true,
    },
    horaInicio: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
        message: 'Formato de hora inválido, use HH:MM',
      },
    },
    horaFin: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
        message: 'Formato de hora inválido, use HH:MM',
      },
    },
    cantidadPersonas: {
      type: Number,
      required: true,
    },
    estado: {
      type: String,
      required: true,
      default: 'Activo',
    },
  },
  {
    timestamps: true,
  }
);

const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = Reserva;