const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const usuarioSchema = new Schema(
  {
    nombreCompleto: {
      type: String,
      required: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ['vecino', 'administrador'],
      required: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    conjuntoId: {
      type: Schema.Types.ObjectId,
      ref: 'Conjunto',
      required: true,
    },
    numeroApartamento: {
      type: Number,
      required: function () {
        return this.rol === 'vecino';
      },
    },
  },
  {
    timestamps: true,
  }
);

usuarioSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;