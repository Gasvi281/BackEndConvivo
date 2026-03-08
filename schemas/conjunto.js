const mongoose = require('mongoose');
const { Schema } = mongoose;

const conjuntoSchema = new Schema(
  {
    nombreConjunto: {
      type: String,
      required: true,
      unique: true,
    },
    direccion: {
      type: String,
      required: true,
      unique: true,
    },
    ciudad: {
      type: String,
      required: true,
    },
    numeroApartamentos: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Conjunto = mongoose.model('Conjunto', conjuntoSchema);
module.exports = Conjunto;