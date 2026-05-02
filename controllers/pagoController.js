const Pago = require('../schemas/pago');
const Usuario = require('../schemas/usuario');
const Conjunto = require('../schemas/conjunto');

/**
 * Translate Stripe error messages from English to Spanish
 */
const translateStripeError = (errorMessage) => {
  if (!errorMessage) return null;

  const translations = {
    // Insufficient funds
    'insufficient_funds': 'Tu tarjeta no tiene fondos suficientes.',
    'Your card has insufficient funds': 'Tu tarjeta no tiene fondos suficientes.',
    'insufficient funds': 'Tu tarjeta no tiene fondos suficientes.',
    
    // Card declined (generic)
    'card_declined': 'Tu tarjeta fue rechazada.',
    'Your card was declined': 'Tu tarjeta fue rechazada.',
    'Your card was declined.': 'Tu tarjeta fue rechazada.',
    'card declined': 'Tu tarjeta fue rechazada.',
    'generic_decline': 'Tu tarjeta fue rechazada por tu banco.',
    'do_not_honor': 'Tu banco rechazó el pago.',
    
    // Expiration
    'expired_card': 'Tu tarjeta ha expirado.',
    'Your card has expired': 'Tu tarjeta ha expirado.',
    'Your card\'s expiration year is invalid': 'El año de vencimiento de tu tarjeta es inválido.',
    'Your card\'s expiration month is invalid': 'El mes de vencimiento de tu tarjeta es inválido.',
    'expired card': 'Tu tarjeta ha expirado.',
    
    // CVC
    'incorrect_cvc': 'El código de seguridad (CVC) de tu tarjeta es incorrecto.',
    'Your card\'s security code is invalid': 'El código de seguridad de tu tarjeta es inválido.',
    'incorrect cvc': 'El código de seguridad de tu tarjeta es incorrecto.',
    'online_or_cvv_required': 'Se requiere CVV para esta transacción.',
    
    // Card number
    'invalid_number': 'El número de tu tarjeta es inválido.',
    'Your card number is invalid': 'El número de tu tarjeta es inválido.',
    'invalid card number': 'El número de tu tarjeta es inválido.',
    
    // Processing
    'processing_error': 'Error al procesar tu tarjeta. Por favor intenta de nuevo.',
    'An error occurred while processing your card': 'Ocurrió un error al procesar tu tarjeta. Por favor intenta de nuevo.',
    'processing error': 'Error al procesar tu tarjeta. Por favor intenta de nuevo.',
    'unable_to_process': 'No se pudo procesar el pago. Por favor intenta de nuevo.',
    
    // Card type/support
    'card_not_supported': 'Esta tarjeta no es soportada.',
    'not_permitted': 'Esta tarjeta no está autorizada para este tipo de transacción.',
    
    // Lost/stolen/restricted
    'lost_card': 'La tarjeta fue reportada como perdida.',
    'stolen_card': 'La tarjeta fue reportada como robada.',
    'restricted_card': 'Esta tarjeta tiene restricciones.',
    'pickup_card': 'Contacta a tu banco inmediatamente.',
    
    // Rate limiting and velocity
    'card_velocity_exceeded': 'Demasiados intentos con esta tarjeta. Intenta más tarde.',
    'rate_limit': 'Límite de intentos excedido. Intenta más tarde.',
    'try_again_later': 'Intenta más tarde.',
    
    // Duplicate and other
    'duplicate_transaction': 'Esta transacción ya fue procesada.',
    'fraud_check': 'La transacción fue rechazada por seguridad.',
    'authentication_required': 'Se requiere autenticación adicional.',
  };

  // Check for exact matches first
  for (const [key, value] of Object.entries(translations)) {
    if (errorMessage === key || errorMessage === `${key}.`) {
      return value;
    }
  }

  // Check for partial/case-insensitive matches
  const lowerMessage = errorMessage.toLowerCase();
  for (const [key, value] of Object.entries(translations)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return value;
    }
  }

  // If no translation found, return original
  return errorMessage;
};

/**
 * Create a new payment for all Vecinos in a Conjunto
 * POST /pago/crear
 */
const createPago = async (req, res) => {
  try {
    const { descripcion, monto, fechaDebida, conjuntoId } = req.body;
    const adminId = req.cuenta.id;

    // Validate required fields
    if (!descripcion || !monto || !fechaDebida || !conjuntoId) {
      return res.status(400).json({ error: 'Campos requeridos: descripcion, monto, fechaDebida, conjuntoId' });
    }

    // Validate monto > 0
    if (monto <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
    }

    // Validate fechaDebida is in the future or today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(fechaDebida);
    dueDate.setHours(0, 0, 0, 0);
    if (dueDate < today) {
      return res.status(400).json({ error: 'La fecha de vencimiento no puede ser anterior a hoy' });
    }

    // Verify Conjunto exists
    const conjunto = await Conjunto.findById(conjuntoId);
    if (!conjunto) {
      return res.status(404).json({ error: 'Conjunto no encontrado' });
    }

    // Get all Vecinos in the Conjunto
    const vecinos = await Usuario.find({ conjuntoId, rol: 'vecino' });
    if (vecinos.length === 0) {
      return res.status(400).json({ error: 'No hay Vecinos en este Conjunto' });
    }

    // Initialize detalles array with all Vecinos
    const detalles = vecinos.map((vecino) => ({
      usuarioId: vecino._id,
      estado: 'Pending',
      fechaPago: null,
      montoReal: null,
      isSimulated: false,
      motivoRechazo: null,
    }));

    // Create the payment
    const pago = await Pago.create({
      conjuntoId,
      descripcion,
      monto,
      fechaDebida,
      estado: 'Activo',
      created_by: adminId,
      detalles,
    });

    // Populate the created_by and detalles usuario info
    await pago.populate('created_by conjuntoId detalles.usuarioId');

    return res.status(201).json(pago);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * List all payments for a Conjunto with aggregated stats
 * GET /pago/listar/:conjuntoId
 */
const listPagosByConjunto = async (req, res) => {
  try {
    const { conjuntoId } = req.params;

    // Verify Conjunto exists
    const conjunto = await Conjunto.findById(conjuntoId);
    if (!conjunto) {
      return res.status(404).json({ error: 'Conjunto no encontrado' });
    }

    // Get all payments for the Conjunto
    const pagos = await Pago.find({ conjuntoId }).populate('created_by');

    // Add aggregated stats to each payment
    const pagosWithStats = pagos.map((pago) => {
      const totalCount = pago.detalles.length;
      const pagadosCount = pago.detalles.filter((d) => d.estado === 'Paid').length;
      const porcentajePagados = totalCount > 0 ? (pagadosCount / totalCount) * 100 : 0;

      return {
        ...pago.toObject(),
        pagadosCount,
        totalCount,
        porcentajePagados: Math.round(porcentajePagados),
      };
    });

    // Sort by creation date (most recent first)
    pagosWithStats.sort((a, b) => b.createdAt - a.createdAt);

    return res.status(200).json(pagosWithStats);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get a single payment with details, sorted by Vecino name/apartment
 * GET /pago/:pagoId
 */
const getPagoDetail = async (req, res) => {
  try {
    const { pagoId } = req.params;

    // Find payment
    const pago = await Pago.findById(pagoId).populate('created_by conjuntoId');
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    // Populate usuario info for detalles
    await pago.populate('detalles.usuarioId');

    // Sort detalles by Vecino last name or apartment number
    const detallesSorted = pago.detalles.sort((a, b) => {
      if (!a.usuarioId || !b.usuarioId) return 0;
      const nameA = a.usuarioId.nombreCompleto || '';
      const nameB = b.usuarioId.nombreCompleto || '';
      return nameA.localeCompare(nameB);
    });

    // Calculate aggregated stats
    const totalCount = pago.detalles.length;
    const pagadosCount = pago.detalles.filter((d) => d.estado === 'Paid').length;
    const pendientesCount = pago.detalles.filter((d) => d.estado === 'Pending').length;
    const vencidosCount = pago.detalles.filter((d) => d.estado === 'Overdue').length;
    const porcentajePagados = totalCount > 0 ? (pagadosCount / totalCount) * 100 : 0;

    const response = {
      ...pago.toObject(),
      detalles: detallesSorted,
      stats: {
        totalCount,
        pagadosCount,
        pendientesCount,
        vencidosCount,
        porcentajePagados: Math.round(porcentajePagados),
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Get payments for a Vecino (their own payments only)
 * GET /pago/vecino/mio
 */
const getMisPagos = async (req, res) => {
  try {
    const vecinoId = req.cuenta.id;

    // Get the Vecino's info to get their conjuntoId
    const vecino = await Usuario.findById(vecinoId);
    if (!vecino) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (vecino.rol !== 'vecino') {
      return res.status(403).json({ error: 'Solo los vecinos pueden acceder a esta información' });
    }

    // Get all payments for the Vecino's Conjunto
    const pagos = await Pago.find({ conjuntoId: vecino.conjuntoId })
      .populate('created_by')
      .lean();

    // Filter and flatten: return only the current user's payment detail
    const misPagos = pagos
      .map((pago) => {
        const detalle = pago.detalles.find((d) => d.usuarioId.toString() === vecinoId);
        if (!detalle) return null;

        return {
          pagoId: pago._id,
          descripcion: pago.descripcion,
          monto: pago.monto,
          fechaDebida: pago.fechaDebida,
          estado: detalle.estado,
          fechaPago: detalle.fechaPago,
          montoReal: detalle.montoReal,
          isSimulated: detalle.isSimulated,
          createdAt: pago.createdAt,
        };
      })
      .filter((p) => p !== null)
      .sort((a, b) => new Date(b.fechaDebida) - new Date(a.fechaDebida));

    return res.status(200).json(misPagos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Process a simulated payment for a Vecino
 * PATCH /pago/:pagoId/pagar-simulado
 */
const pagarSimulado = async (req, res) => {
  try {
    const { pagoId } = req.params;
    const { montoReal } = req.body;
    const vecinoId = req.cuenta.id;

    // Find payment
    const pago = await Pago.findById(pagoId);
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    // Find the user's detail in the payment
    const detalleIndex = pago.detalles.findIndex(
      (d) => d.usuarioId.toString() === vecinoId
    );

    if (detalleIndex === -1) {
      return res.status(400).json({ error: 'Usuario no encontrado en este pago' });
    }

    const detalle = pago.detalles[detalleIndex];

    // Validate: user must not have already paid
    if (detalle.estado === 'Paid') {
      return res.status(400).json({ error: 'Este pago ya fue procesado' });
    }

    // Update the payment detail (preserve all fields including usuarioId)
    pago.detalles[detalleIndex].estado = 'Paid';
    pago.detalles[detalleIndex].fechaPago = new Date();
    pago.detalles[detalleIndex].montoReal = montoReal || pago.monto;
    pago.detalles[detalleIndex].isSimulated = true;

    // Save the updated payment
    await pago.save();

    // Populate and return
    await pago.populate('created_by conjuntoId detalles.usuarioId');

    return res.status(200).json({
      message: 'Pago procesado correctamente',
      pago: pago
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Create a PaymentIntent for Stripe payment
 * POST /pago/:pagoId/create-payment-intent
 */
const createPaymentIntent = async (req, res) => {
  try {
    const stripe = require('../config/stripe');
    const { pagoId } = req.params;
    const vecinoId = req.cuenta.id;

    // Find payment
    const pago = await Pago.findById(pagoId);
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    // Find the user's detail in the payment
    const detalleIndex = pago.detalles.findIndex(
      (d) => d.usuarioId.toString() === vecinoId
    );

    if (detalleIndex === -1) {
      return res.status(400).json({ error: 'Usuario no encontrado en este pago' });
    }

    const detalle = pago.detalles[detalleIndex];

    // Validate: user must not have already paid
    if (detalle.estado === 'Paid') {
      return res.status(400).json({ error: 'Este pago ya fue procesado' });
    }

    // Validate: payment must not have failed previously
    if (detalle.estado === 'Failed' || detalle.estado === 'Refunded') {
      return res.status(400).json({ error: 'Este pago no puede ser procesado' });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(pago.monto * 100), // Convert to cents
      currency: 'cop', // Colombian Peso
      description: `Pago: ${pago.descripcion}`,
      metadata: {
        pagoId: pagoId.toString(),
        vecinoId: vecinoId,
        detalleIndex: detalleIndex,
      },
    });

    // Store PaymentIntent ID in the database
    pago.detalles[detalleIndex].stripePaymentIntentId = paymentIntent.id;
    await pago.save();

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Confirm a payment after Stripe processes the card
 * PATCH /pago/:pagoId/confirm-payment
 */
const confirmPayment = async (req, res) => {
  try {
    const stripe = require('../config/stripe');
    const { pagoId } = req.params;
    const { paymentIntentId } = req.body;
    const vecinoId = req.cuenta.id;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'paymentIntentId es requerido' });
    }

    // Find payment
    const pago = await Pago.findById(pagoId);
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    // Find the user's detail in the payment
    const detalleIndex = pago.detalles.findIndex(
      (d) => d.usuarioId.toString() === vecinoId
    );

    if (detalleIndex === -1) {
      return res.status(400).json({ error: 'Usuario no encontrado en este pago' });
    }

    const detalle = pago.detalles[detalleIndex];

    // Validate: user must not have already paid
    if (detalle.estado === 'Paid') {
      return res.status(400).json({ error: 'Este pago ya fue procesado' });
    }

    // Retrieve PaymentIntent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const lastPaymentError = paymentIntent.last_payment_error;
    const lastPaymentMessage = lastPaymentError?.message || null;
    const translatedMessage = translateStripeError(lastPaymentMessage);

    if (paymentIntent.status === 'succeeded') {
      // Payment successful - find the charge ID
      const chargeId = paymentIntent.charges?.data?.[0]?.id || null;

      // Update the payment detail
      pago.detalles[detalleIndex].estado = 'Paid';
      pago.detalles[detalleIndex].fechaPago = new Date();
      pago.detalles[detalleIndex].montoReal = pago.monto;
      pago.detalles[detalleIndex].isSimulated = false;
      pago.detalles[detalleIndex].stripeChargeId = chargeId;
      pago.detalles[detalleIndex].stripeError = null;

      await pago.save();
      await pago.populate('created_by conjuntoId detalles.usuarioId');

      return res.status(200).json({
        message: 'Pago procesado correctamente',
        pago: pago,
      });
    } else if (paymentIntent.status === 'requires_action') {
      // Payment requires 3D Secure or other authentication
      return res.status(402).json({
        error: 'El pago requiere autenticación adicional',
        clientSecret: paymentIntent.client_secret,
        stripeError: translatedMessage,
      });
    } else if (paymentIntent.status === 'requires_payment_method') {
      // Payment failed or requires a different payment method
      const lastMsg = translatedMessage || 'Método de pago rechazado';
      pago.detalles[detalleIndex].stripeError = lastMsg;
      await pago.save();

      return res.status(400).json({
        error: 'El método de pago fue rechazado',
        stripeError: lastMsg,
        declineCode: lastPaymentError?.decline_code || null,
        code: lastPaymentError?.code || null,
      });
    } else {
      // Other status
      const lastMsg = translatedMessage || `Estado de pago no esperado: ${paymentIntent.status}`;
      pago.detalles[detalleIndex].stripeError = lastMsg;
      await pago.save();

      return res.status(400).json({
        error: `Estado de pago no esperado: ${paymentIntent.status}`,
        stripeError: lastMsg,
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Refund a payment (admin only)
 * PATCH /pago/:pagoId/refund/:usuarioId
 */
const refundPayment = async (req, res) => {
  try {
    const stripe = require('../config/stripe');
    const { pagoId, usuarioId } = req.params;
    const { motivo } = req.body;

    // Find payment
    const pago = await Pago.findById(pagoId);
    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    // Find the user's detail in the payment
    const detalleIndex = pago.detalles.findIndex(
      (d) => d.usuarioId.toString() === usuarioId
    );

    if (detalleIndex === -1) {
      return res.status(400).json({ error: 'Usuario no encontrado en este pago' });
    }

    const detalle = pago.detalles[detalleIndex];

    // Validate: must have a charge ID to refund
    if (!detalle.stripeChargeId) {
      return res.status(400).json({ error: 'No hay cargo de Stripe para reembolsar' });
    }

    // Validate: must be in Paid state
    if (detalle.estado !== 'Paid') {
      return res.status(400).json({ error: 'Solo se pueden reembolsar pagos completados' });
    }

    // Create refund via Stripe
    const refund = await stripe.refunds.create({
      charge: detalle.stripeChargeId,
      reason: 'requested_by_merchant',
      metadata: {
        pagoId: pagoId.toString(),
        usuarioId: usuarioId,
        motivo: motivo || 'Reembolso solicitado',
      },
    });

    // Update the payment detail
    pago.detalles[detalleIndex].estado = 'Refunded';
    pago.detalles[detalleIndex].motivoRechazo = motivo || 'Reembolso solicitado';

    await pago.save();
    await pago.populate('created_by conjuntoId detalles.usuarioId');

    return res.status(200).json({
      message: 'Reembolso procesado correctamente',
      refundId: refund.id,
      pago: pago,
    });
  } catch (error) {
    console.error('Error refunding payment:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPago,
  listPagosByConjunto,
  getPagoDetail,
  getMisPagos,
  pagarSimulado,
  createPaymentIntent,
  confirmPayment,
  refundPayment,
};
