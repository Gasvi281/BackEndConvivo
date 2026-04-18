const Pago = require('../schemas/pago');
const Usuario = require('../schemas/usuario');
const Conjunto = require('../schemas/conjunto');

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

module.exports = {
  createPago,
  listPagosByConjunto,
  getPagoDetail,
  getMisPagos,
};
