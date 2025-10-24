const { json } = require("body-parser");
const { Usuario, sequelize } = require("../models");
const { Admin } = require("../models");
const { Vecino } = require("../models");
const { Conjunto, Espacio } = require("../models");
const bcrypt=require("bcryptjs");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");

const createEspacio = async (req, res) => {
    console.log('BODY RECIBIDO:', req.body);

    try {
        const { nombre,
            descripcion,
            conjuntoId,
            horaInicio,
            horaFin,
            diasHabilitados,
            cantidadPersonas,
            tiempoMaximo,
            estadoEspacio
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
            estadoEspacio
        });

        return res.status(201).json(espacio);
    } catch (error) {
        console.log("Error creando el espacio", error);
        return res.status(500).json({ error: error.message || error.toString() })
    }
}

const getEspacios = async (req, res) => {
    try {
        const espacios = await Espacio.findAll();

        return res.status(200).json(espacios);
    } catch (error) {
        return res.status(404).json({ error: "Espacios no encontrados" })
    }
}

const getEspaciosByConjuntoId = async (req, res) => {
    try {
        const { conjuntoId } = req.params

        const espaciosConjunto = await Espacio.findAll({ where: { conjuntoId } })

        if (!espaciosConjunto) {
            return res.status(404).json({ error: "El id es erroneo o el conjunto no tiene espacios" })
        }

        return res.status(200).json(espaciosConjunto);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const getEspacioById = async (req, res) => {
    try {
        const { id } = req.params

        const espacio = await Espacio.findOne({ where: { id } })

        if (!espacio) {
            return res.status(404).json({ error: "No existe este espacio" })
        }

        return res.status(200).json(espacio);
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createEspacio,
    getEspacios,
    getEspaciosByConjuntoId,
    getEspacioById
};