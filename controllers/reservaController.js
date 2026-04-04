const Reserva = require("../schemas/reserva");
const Espacio = require("../schemas/espacio");
const Usuario = require("../schemas/usuario");
const { enviarMailConfirm } = require("../services/emailService");

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

    const usuario = Usuario.findById(usuarioId);

    const tokenConfirm = jwt.sign(
                {
                    id: reserva._id,
                }, process.env.JWT_SECRET,
                { expiresIn: "1h" }
            )
    
    const confirmLink = `http://localhost:4200/espacios/confirm?token=${tokenConfirm}`
    
    await enviarMailConfirm(usuario.correo, "Confirmacion Reserva", { confirmLink })

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

const activateReserva = async(req, res) => {
  try {
    const {token} = req.body
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const reserva = await Reserva.findById(decoded.id)
    if(!reserva){
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    reserva.estado = 'Activo'
    await reserva.save()

    return res.status(200).json(reserva);
  } catch (error) {
    return res.status(400).json({ error: "Token invalido o expirado" });
  }
}

module.exports = {
  createReserva,
  getReservas,
  getReservaById,
  getReservasByUsuarioId,
  getReservasPasadas,
  deleteReserva,
  updateReserva,
  activateReserva
};