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

const getEspaciosActivosByConjuntoId = async (req, res) => {
    try {
        const { conjuntoId } = req.params

        const espaciosActivosConjunto = await Espacio.findAll({ where: { conjuntoId, estadoEspacio: 'Activo' } })

        if (!espaciosActivosConjunto) {
            return res.status(404).json({ error: "El id es erroneo o el conjunto no tiene espacios" })
        }

        return res.status(200).json(espaciosActivosConjunto);
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

const updateEspacio = async (req,res) => {
    try {
        const {conjuntoId} = req.params
        const {nombre, descripcion, horaInicio, horaFin, diasHabilitados, estadoEspacio, cantidadPersonas, tiempoMaximo} = req.body;

        const espacio = await Espacio.findByPk(conjuntoId);
        if(!espacio){
            return res.status(404).json({ message: "Reserva no encontrada"});
        }

        if(nombre) espacio.nombre = nombre
        if(descripcion) espacio.descripcion = descripcion
        if(horaInicio) espacio.horaInicio = horaInicio
        if(horaFin) espacio.horaFin = horaFin
        if(diasHabilitados) espacio.diasHabilitados = diasHabilitados
        if(estadoEspacio) espacio.estadoEspacio = estadoEspacio
        if(cantidadPersonas) espacio.cantidadPersonas = cantidadPersonas
        if(tiempoMaximo) espacio.tiempoMaximo = tiempoMaximo

        await espacio.save();

        return res.status(200).json({message: "Espacio actualizado correctamente"})
    } catch (error) {
        console.error('Error al actualizar espacio: ', error);
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    createEspacio,
    getEspacios,
    getEspaciosByConjuntoId,
    getEspaciosActivosByConjuntoId,
    getEspacioById,
    updateEspacio
};