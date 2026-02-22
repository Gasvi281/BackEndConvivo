const { json } = require("body-parser");
const { Usuario, sequelize } = require("../models");
const { Admin } = require("../models");
const { Vecino } = require("../models");
const { Comentario } = require("../models");
const { Espacio } = require("../models");
const bcrypt=require("bcryptjs");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');

const createComentario = async(req, res) => {
    try {
        const { descripcion,
            asunto,
            usuarioId,
            usuarioLigado,
        } = req.body;

        let comentario = null

        if(usuarioLigado){

            comentario = await Comentario.create({
            descripcion,
            asunto,
            usuarioId,
            usuarioLigado,
        });

        } else {

            comentario = await Comentario.create({
            descripcion,
            asunto,
            usuarioId,
        });

        }

        return res.status(201).json(comentario);
    } catch (error) {
        console.log("Error creando comentario", error);
        return res.status(500).json({ error: error.message || error.toString() })
    }
}

const getComentarios = async (req, res) => {
    try {
        const comentarios = await Comentario.findAll();

        return res.status(200).json(comentarios);
    } catch (error) {
        return res.status(404).json({error: "Comentarios no encontrados"})
    }
}

const getComentarioById = async (req, res) => {
        const {id} = req.params

        const comentario = await Comentario.findOne({where: {id}})

        if(!comentario){
            return res.status(404).json({error: "No existe este comentario"})
        }

        return res.status(200).json(comentario); 
}

const getComentariosByUsuarioId = async (req, res) => {
    try {
        const { usuarioId } = req.params

        const comentarios = await Comentario.findAll({ where: { usuarioId } })

        if (!comentarios) {
            return res.status(404).json({ error: "El id es erroneo o el usuario no tiene comentarios" })
        }

        return res.status(200).json(comentarios);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createComentario,
    getComentarios,
    getComentarioById,
    getComentariosByUsuarioId,
};