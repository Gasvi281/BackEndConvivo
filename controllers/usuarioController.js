const Usuario = require("../schemas/usuario");
const Conjunto = require("../schemas/conjunto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUsuario = async (req, res) => {
  try {
    const { nombreCompleto, correo, password, rol, conjuntoId, telefono, numeroApartamento } = req.body;

    const existeConjunto = await Conjunto.findById(conjuntoId);
    if (!existeConjunto) {
      return res.status(404).json({ error: "Este conjunto no existe" });
    }

    const existe = await Usuario.findOne({ correo });
    if (existe) {
      return res.status(400).json({ error: "Correo ya existe" });
    }

    const usuario = await Usuario.create({
      nombreCompleto,
      correo,
      password,
      rol,
      conjuntoId,
      telefono,
      numeroApartamento: rol === "vecino" ? numeroApartamento : undefined,
    });

    return res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(404).json({ error: "Usuarios no encontrados" });
  }
};

const getUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id).populate("conjuntoId");
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findOne({ correo: decoded.correo });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    usuario.password = newPassword;
    await usuario.save();

    return res.status(200).json(usuario);
  } catch {
    return res.status(400).json({ error: "Token invalido o expirado" });
  }
};

const updateUsuarioVecino = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreCompleto, correo, conjuntoId, numeroApartamento, telefono } = req.body;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (nombreCompleto) usuario.nombreCompleto = nombreCompleto;
    if (correo) usuario.correo = correo;
    if (conjuntoId) usuario.conjuntoId = conjuntoId;
    if (telefono) usuario.telefono = telefono;
    if (numeroApartamento) usuario.numeroApartamento = numeroApartamento;

    await usuario.save();
    return res.status(200).json({ message: "Vecino actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateUsuarioAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreCompleto, correo, telefono } = req.body;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (nombreCompleto) usuario.nombreCompleto = nombreCompleto;
    if (correo) usuario.correo = correo;
    if (telefono) usuario.telefono = telefono;

    await usuario.save();
    return res.status(200).json({ message: "Admin actualizado correctamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getVecinosByConjunto = async (req, res) => {
  try {
    const { conjunto } = req.params;
    const usuarios = await Usuario.find({ conjuntoId: conjunto, rol: "vecino" });
    if (!usuarios.length) {
      return res.status(404).json({ error: "El conjunto no tiene vecinos" });
    }
    return res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUsuario,
  getUsuarios,
  getUsuario,
  changePassword,
  updateUsuarioVecino,
  updateUsuarioAdmin,
  getVecinosByConjunto,
};