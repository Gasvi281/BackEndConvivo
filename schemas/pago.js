const mongoose = require('mongoose');
const { Schema } = mongoose;

const detallePagoSchema = new Schema(
  {
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    estado: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Overdue', 'Refunded'],
      default: 'Pending',
      required: true,
    },
    fechaPago: {
      type: Date,
      default: null,
    },
    montoReal: {
      type: Number,
      default: null,
    },
    isSimulated: {
      type: Boolean,
      default: false,
    },
    motivoRechazo: {
      type: String,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    stripeChargeId: {
      type: String,
      default: null,
    },
    stripeError: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const pagoSchema = new Schema(
  {
    conjuntoId: {
      type: Schema.Types.ObjectId,
      ref: 'Conjunto',
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    monto: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v > 0,
        message: 'El monto debe ser mayor a 0',
      },
    },
    fechaDebida: {
      type: Date,
      required: true,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    estado: {
      type: String,
      enum: ['Activo', 'Inactivo'],
      default: 'Activo',
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    detalles: [detallePagoSchema],
  },
  {
    timestamps: true,
  }
);

const Pago = mongoose.model('Pago', pagoSchema);
module.exports = Pago;
