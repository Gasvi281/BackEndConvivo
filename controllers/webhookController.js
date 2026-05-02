const stripe = require('../config/stripe');
const Pago = require('../schemas/pago');

/**
 * Handle Stripe webhook events
 * POST /webhook/stripe
 */
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Get raw body from request
    let rawBody = req.body;
    
    // If body is already parsed (Buffer), use it directly
    if (Buffer.isBuffer(req.body)) {
      rawBody = req.body.toString('utf-8');
    } else if (typeof req.body === 'object') {
      // If already parsed as JSON, convert back to string for verification
      rawBody = JSON.stringify(req.body);
    }

    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object);
        break;

      case 'charge.failed':
        await handleChargeFailed(event.data.object);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;

      case 'payment_intent.succeeded':
        // Double confirmation via PaymentIntent
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Error handling webhook event:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Handle charge.succeeded event
 */
const handleChargeSucceeded = async (charge) => {
  try {
    const pagoId = charge.metadata?.pagoId;
    const vecinoId = charge.metadata?.vecinoId;
    const detalleIndex = charge.metadata?.detalleIndex;

    if (!pagoId || !vecinoId || detalleIndex === undefined) {
      console.log('Missing metadata in charge:', charge.id);
      return;
    }

    const pago = await Pago.findById(pagoId);
    if (!pago) {
      console.log('Payment not found:', pagoId);
      return;
    }

    const detalle = pago.detalles[detalleIndex];
    if (!detalle) {
      console.log('Detail not found for payment:', pagoId);
      return;
    }

    // Update only if not already paid (prevent double-pay)
    if (detalle.estado !== 'Paid') {
      detalle.estado = 'Paid';
      detalle.fechaPago = new Date(charge.created * 1000); // Stripe timestamp is in seconds
      detalle.montoReal = charge.amount / 100; // Convert from cents
      detalle.isSimulated = false;
      detalle.stripeChargeId = charge.id;

      await pago.save();
      console.log(`Payment marked as Paid via webhook: ${pagoId}`);
    }
  } catch (err) {
    console.error('Error handling charge.succeeded:', err);
  }
};

/**
 * Handle charge.failed event
 */
const handleChargeFailed = async (charge) => {
  try {
    const pagoId = charge.metadata?.pagoId;
    const vecinoId = charge.metadata?.vecinoId;
    const detalleIndex = charge.metadata?.detalleIndex;

    if (!pagoId || !vecinoId || detalleIndex === undefined) {
      console.log('Missing metadata in failed charge:', charge.id);
      return;
    }

    const pago = await Pago.findById(pagoId);
    if (!pago) {
      console.log('Payment not found:', pagoId);
      return;
    }

    const detalle = pago.detalles[detalleIndex];
    if (!detalle) {
      console.log('Detail not found for payment:', pagoId);
      return;
    }

    // Only update if still Pending
    if (detalle.estado === 'Pending') {
      detalle.estado = 'Failed';
      detalle.stripeError = charge.failure_message || 'El cargo fue rechazado';

      await pago.save();
      console.log(`Payment marked as Failed via webhook: ${pagoId}`);
    }
  } catch (err) {
    console.error('Error handling charge.failed:', err);
  }
};

/**
 * Handle charge.refunded event
 */
const handleChargeRefunded = async (charge) => {
  try {
    const pagoId = charge.metadata?.pagoId;
    const vecinoId = charge.metadata?.vecinoId;
    const detalleIndex = charge.metadata?.detalleIndex;

    if (!pagoId || !vecinoId || detalleIndex === undefined) {
      console.log('Missing metadata in refunded charge:', charge.id);
      return;
    }

    const pago = await Pago.findById(pagoId);
    if (!pago) {
      console.log('Payment not found:', pagoId);
      return;
    }

    const detalle = pago.detalles[detalleIndex];
    if (!detalle) {
      console.log('Detail not found for payment:', pagoId);
      return;
    }

    // Update to Refunded
    if (detalle.estado === 'Paid') {
      detalle.estado = 'Refunded';
      detalle.motivoRechazo = 'Reembolso procesado';

      await pago.save();
      console.log(`Payment marked as Refunded via webhook: ${pagoId}`);
    }
  } catch (err) {
    console.error('Error handling charge.refunded:', err);
  }
};

/**
 * Handle payment_intent.succeeded event (redundant with charge.succeeded but good for logging)
 */
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    const pagoId = paymentIntent.metadata?.pagoId;
    console.log(`PaymentIntent succeeded: ${paymentIntent.id} for pago: ${pagoId}`);
  } catch (err) {
    console.error('Error handling payment_intent.succeeded:', err);
  }
};

/**
 * Handle payment_intent.payment_failed event
 */
const handlePaymentIntentFailed = async (paymentIntent) => {
  try {
    const pagoId = paymentIntent.metadata?.pagoId;
    console.log(`PaymentIntent failed: ${paymentIntent.id} for pago: ${pagoId}`);
  } catch (err) {
    console.error('Error handling payment_intent.payment_failed:', err);
  }
};

module.exports = {
  handleStripeWebhook,
};
