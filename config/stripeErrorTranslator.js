/**
 * Translate Stripe error messages to Spanish
 */
const stripeErrorTranslations = {
  'Your card has insufficient funds': 'Tu tarjeta no tiene fondos suficientes',
  'Your card was declined': 'Tu tarjeta fue rechazada',
  'Your card has been declined.': 'Tu tarjeta fue rechazada',
  'card_declined': 'Tu tarjeta fue rechazada',
  'Your card has expired': 'Tu tarjeta ha vencido',
  'Incorrect CVC': 'Código de seguridad (CVC) incorrecto',
  'Incorrect zip': 'Código postal incorrecto',
  'Processing error': 'Error al procesar el pago',
  'Rate limit': 'Límite de intentos excedido, intenta más tarde',
  'Lost card': 'La tarjeta fue reportada como perdida',
  'Stolen card': 'La tarjeta fue reportada como robada',
  'Expired card': 'La tarjeta ha expirado',
  'Incorrect CVC.': 'Código de seguridad (CVC) incorrecto',
  'Card declined': 'La tarjeta fue rechazada',
  'Generic decline': 'Tu tarjeta fue rechazada por tu banco',
  'General decline': 'Tu tarjeta fue rechazada por tu banco',
  'fraudulent': 'La transacción fue rechazada por seguridad',
  'authentication_required': 'Se requiere autenticación adicional',
  'approve_with_id': 'Se requiere verificación de identidad',
  'call_issuer': 'Contacta a tu banco para autorizar el pago',
  'card_not_supported': 'Esta tarjeta no es soportada',
  'card_velocity_exceeded': 'Demasiados intentos con esta tarjeta, intenta más tarde',
  'currency_not_supported': 'La moneda no es soportada para esta tarjeta',
  'do_not_honor': 'Tu banco rechazó el pago',
  'do_not_try_again': 'No intentes de nuevo con esta tarjeta',
  'duplicate_transaction': 'Esta transacción ya fue procesada',
  'expired_card': 'La tarjeta ha expirado',
  'incorrect_cvc': 'Código de seguridad (CVC) incorrecto',
  'incorrect_pin': 'PIN incorrecto',
  'incorrect_zip': 'Código postal incorrecto',
  'insufficient_funds': 'Tu tarjeta no tiene fondos suficientes',
  'invalid_account': 'Esta tarjeta no es válida',
  'invalid_amount': 'Monto inválido',
  'lost_card': 'La tarjeta fue reportada como perdida',
  'merchant_blacklist': 'Esta transacción fue rechazada',
  'new_account_information_available': 'Información de la tarjeta no disponible',
  'no_action_taken': 'El pago fue rechazado',
  'not_permitted': 'Esta tarjeta no está autorizada para este tipo de transacción',
  'offline_pin_required': 'Se requiere PIN offline',
  'online_or_cvv_required': 'Se requiere CVV para esta transacción',
  'pickup_card': 'Contacta a tu banco inmediatamente',
  'restricted_card': 'Esta tarjeta tiene restricciones',
  'revocation_of_all_authorizations': 'Todas las autorizaciones fueron revocadas',
  'revocation_of_authorization': 'La autorización fue revocada',
  'security_violation': 'Violación de seguridad detectada',
  'service_not_allowed': 'Este servicio no está permitido',
  'stolen_card': 'La tarjeta fue reportada como robada',
  'stop_payment_order': 'Orden de parada activada para esta tarjeta',
  'testmode_decline': 'Esta es una tarjeta de prueba rechazada',
  'transaction_not_allowed': 'Esta transacción no está permitida',
  'try_again_later': 'Intenta más tarde',
  'unable_to_process': 'No se pudo procesar el pago',
  'withdrawal_count_limit_exceeded': 'Límite de retiros excedido'
};

/**
 * Translate Stripe error message to Spanish
 * @param {string} message - The Stripe error message in English
 * @returns {string} - Spanish translation or original message if not found
 */
const translateStripeError = (message) => {
  if (!message) return 'Error al procesar el pago';
  
  // Try exact match first
  if (stripeErrorTranslations[message]) {
    return stripeErrorTranslations[message];
  }

  // Try case-insensitive match
  for (const [en, es] of Object.entries(stripeErrorTranslations)) {
    if (message.toLowerCase().includes(en.toLowerCase())) {
      return es;
    }
  }

  // If no match, return a generic message with the original (may help debug)
  return message;
};

module.exports = { translateStripeError, stripeErrorTranslations };
