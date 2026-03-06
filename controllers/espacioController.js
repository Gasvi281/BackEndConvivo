const Espacio = require("../schemas/espacio");

const createEspacio = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      conjuntoId,
      horaInicio,
      horaFin,
      diasHabilitados,
      cantidadPersonas,
      tiempoMaximo,
      estadoEspacio,
    } = req.body;

    const espacio = await Espacio.create({
      nombre,
      descripcion,
      conjuntoId,
      horaInicio,
      horaFin,
      diasHabilitados,
      cantidadPersonas,
      tiempoMaximo,
      estadoEspacio,
    });

    return res.status(201).json(espacio);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getEspacios = async (req, res) => {
  try {
    const espacios = await Espacio.find();
    if (!espacios.length) {
      return res.status(404).json({ error: "Espacios no encontrados" });
    }
    return res.status(200).json(espacios);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getEspaciosByConjuntoId = async (req, res) => {
  try {
    const { conjuntoId } = req.params;
    const espacios = await Espacio.find({ conjuntoId });
    if (!espacios.length) {
      return res.status(404).json({ error: "El conjunto no tiene espacios" });
    }
    return res.status(200).json(espacios);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getEspaciosActivosByConjuntoId = async (req, res) => {
  try {
    const { conjuntoId } = req.params;
    const espacios = await Espacio.find({ conjuntoId, estadoEspacio: "Activo" });
    if (!espacios.length) {
      return res.status(404).json({ error: "El conjunto no tiene espacios activos" });
    }
    return res.status(200).json(espacios);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getEspacioById = async (req, res) => {
  try {
    const { id } = req.params;
    const espacio = await Espacio.findById(id);
    if (!espacio) {
      return res.status(404).json({ error: "No existe este espacio" });
    }
    return res.status(200).json(espacio);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateEspacio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, horaInicio, horaFin, diasHabilitados, estadoEspacio, cantidadPersonas, tiempoMaximo } = req.body;

    const espacio = await Espacio.findById(id);
    if (!espacio) {
      return res.status(404).json({ message: "Espacio no encontrado" });
    }

    if (nombre) espacio.nombre = nombre;
    if (descripcion) espacio.descripcion = descripcion;
    if (horaInicio) espacio.horaInicio = horaInicio;
    if (horaFin) espacio.horaFin = horaFin;
    if (diasHabilitados) espacio.diasHabilitados = diasHabilitados;
    if (estadoEspacio) espacio.estadoEspacio = estadoEspacio;
    if (cantidadPersonas) espacio.cantidadPersonas = cantidadPersonas;
    if (tiempoMaximo) espacio.tiempoMaximo = tiempoMaximo;

    await espacio.save();
    return res.status(200).json({ message: "Espacio actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createEspacio,
  getEspacios,
  getEspaciosByConjuntoId,
  getEspaciosActivosByConjuntoId,
  getEspacioById,
  updateEspacio,
};