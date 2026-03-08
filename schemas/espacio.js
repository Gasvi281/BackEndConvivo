const mongoose = require('mongoose');
const { Schema } = mongoose;

const espacioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    conjuntoId: {
      type: Schema.Types.ObjectId,
      ref: 'Conjunto',
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
    diasHabilitados: {
      type: [String],
      required: true,
    },
    estadoEspacio: {
      type: String,
      required: true,
      default: 'Activo',
    },
    cantidadPersonas: {
      type: Number,
      required: true,
    },
    tiempoMaximo: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Espacio = mongoose.model('Espacio', espacioSchema);
module.exports = Espacio;