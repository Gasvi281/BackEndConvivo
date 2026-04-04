const Comentario = require("../schemas/comentario");
const Usuario = require("../schemas/usuario");
const mongoose = require("mongoose");

const createComentario = async (req, res) => {
  try {
    const { descripcion, asunto, tipo, usuarioId, usuarioLigado } = req.body;

    const comentario = await Comentario.create({
      descripcion,
      asunto,
      tipo,
      usuarioId,
      usuarioLigado,
    });

    return res.status(201).json(comentario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getComentarios = async (req, res) => {
  try {
    const comentarios = await Comentario.find();
    if (!comentarios.length) {
      return res.status(404).json({ error: "Comentarios no encontrados" });
    }
    return res.status(200).json(comentarios);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getComentarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const comentario = await Comentario.findById(id);
    if (!comentario) {
      return res.status(404).json({ error: "No existe este comentario" });
    }
    return res.status(200).json(comentario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getComentariosByUsuarioId = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const comentarios = await Comentario.find({ usuarioId }).populate("usuarioLigado");
    if (!comentarios.length) {
      return res.status(404).json({ error: "El usuario no tiene comentarios" });
    }
    return res.status(200).json(comentarios);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getComentariosLigadosByUsuarioId = async (req,res) => {
  try {
    const { usuarioId } = req.params;
    const comentarios = await Comentario.find({ usuarioLigado: usuarioId }).populate("usuarioId");
    if (!comentarios.length) {
      return res.status(404).json({ error: "El usuario no tiene comentarios" });
    }
    return res.status(200).json(comentarios);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
const getAnunciosByConjuntoId = async (req, res) => {
  try {
    const { conjuntoId } = req.params;

    const admins = await Usuario.find(
      { conjuntoId: new mongoose.Types.ObjectId(conjuntoId), rol: 'administrador' },
      { _id: 1 }
    );

    const adminIds = admins.map(a => a._id);

    const anuncios = await Comentario.find({
      usuarioId: { $in: adminIds },
      tipo: 'Anuncio'
    });

    if (!anuncios.length) {
      return res.status(404).json({ error: 'No hay anuncios para este conjunto' });
    }

    return res.status(200).json(anuncios);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteComentario = async (req, res) => {
  try {
    const { id } = req.params;
    const comentario = await Comentario.findByIdAndDelete(id);
    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }
    return res.status(200).json({ message: "Comentario eliminado exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createComentario,
  getComentarios,
  getComentarioById,
  getComentariosByUsuarioId,
  getComentariosLigadosByUsuarioId,
  getAnunciosByConjuntoId,
  deleteComentario
};