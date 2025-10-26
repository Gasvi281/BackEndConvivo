const { json } = require("body-parser");
const { Usuario, sequelize } = require("../models");
const { Admin } = require("../models");
const { Vecino } = require("../models");
const { Reserva } = require("../models");
const bcrypt=require("bcryptjs");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");

const createReserva = async(req, res) => {
    try {
        const { usuarioId,
            espacioId,
            fecha,
            horaInicio,
            horaFin,
            cantidadPersonas, 
        } = req.body;

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
        console.log("Error creando la reserva", error);
        return res.status(500).json({ error: error.message || error.toString() })
    }
}

const getReservas = async (req, res) => {
    try {
        const reservas = await Reserva.findAll();

        return res.status(200).json(reservas);
    } catch (error) {
        return res.status(404).json({error: "Reservas no encontrados"})
    }
}

const getReservaById = async (req, res) => {
        const {id} = req.params

        const reserva = await Reserva.findOne({where: {id}})

        if(!reserva){
            return res.tatus(404).json({error: "No existe esta reserva"})
        }

        return res.status(200).json(reserva); 
}

module.exports = {
    createReserva,
    getReservas,
    getReservaById
};