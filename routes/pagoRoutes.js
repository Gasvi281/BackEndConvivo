const express = require('express');
const router = express.Router();
const PagoController = require('../controllers/pagoController');
const authService = require('../services/authService');
const rolService = require('../services/rolService');

// Admin endpoints
router.post(
  '/crear',
  authService,
  rolService(['administrador']),
  PagoController.createPago
);

router.get(
  '/listar/:conjuntoId',
  authService,
  rolService(['administrador']),
  PagoController.listPagosByConjunto
);

// Vecino endpoint - Must come BEFORE /:pagoId to avoid being caught by wildcard
router.get(
  '/vecino/mio',
  authService,
  PagoController.getMisPagos
);

// Admin endpoint - Get single payment detail (must be last to avoid catching other routes)
router.get(
  '/:pagoId',
  authService,
  rolService(['administrador']),
  PagoController.getPagoDetail
);

module.exports = router;
