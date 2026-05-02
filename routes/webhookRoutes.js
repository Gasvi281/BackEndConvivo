const express = require('express');
const { handleStripeWebhook } = require('../controllers/webhookController');

const router = express.Router();

/**
 * Stripe webhook endpoint
 * POST /webhook/stripe
 * No authentication required (Stripe will sign the request)
 * Must receive raw body for signature verification
 */
router.post('/stripe', express.raw({type: 'application/json'}), handleStripeWebhook);

module.exports = router;
