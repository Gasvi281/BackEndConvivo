const Reserva = require("../schemas/reserva");
const Espacio = require("../schemas/espacio");

const createReserva = async (req, res) => {
  try {
    const { usuarioId, espacioId, fecha, horaInicio, horaFin, cantidadPersonas } = req.body;

    const reserva = await Reserva.create({
      usuarioId,
      espacioId,
      fecha,
      horaInicio,
      horaFin,
      cantidadPersonas,
    });

    return res.status(201).json(reserva);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find();
    if (!reservas.length) {
      return res.status(404).json({ error: "Reservas no encontradas" });
    }
    return res.status(200).json(reservas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getReservaById = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findById(id);
    if (!reserva) {
      return res.status(404).json({ error: "No existe esta reserva" });
    }
    return res.status(200).json(reserva);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getReservasByUsuarioId = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const reservas = await Reserva.find({
      usuarioId,
      fecha: { $gte: hoy.toISOString() },
    })
      .populate("espacioId", "nombre descripcion")
      .sort({ fecha: 1 });

    if (!reservas.length) {
      return res.status(404).json({ error: "Este usuario no tiene reservas" });
    }

    return res.status(200).json(reservas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getReservasPasadas = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const reservas = await Reserva.find({
      usuarioId,
      fecha: { $lt: hoy.toISOString() },
    })
      .populate("espacioId", "nombre descripcion")
      .sort({ fecha: 1 });

    if (!reservas.length) {
      return res.status(404).json({ error: "Este usuario no tiene reservas pasadas" });
    }

    return res.status(200).json(reservas);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByIdAndDelete(id);
    if (!reserva) {
      return res.status(404).json({ error: "No existe esta reserva" });
    }
    return res.status(200).json({ message: "Reserva eliminada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, horaInicio, horaFin, cantidadPersonas } = req.body;

    const reserva = await Reserva.findById(id);
    if (!reserva) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    if (fecha) reserva.fecha = fecha;
    if (horaInicio) reserva.horaInicio = horaInicio;
    if (horaFin) reserva.horaFin = horaFin;
    if (cantidadPersonas) reserva.cantidadPersonas = cantidadPersonas;

    await reserva.save();
    return res.status(200).json({ message: "Reserva actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createReserva,
  getReservas,
  getReservaById,
  getReservasByUsuarioId,
  getReservasPasadas,
  deleteReserva,
  updateReserva,
};