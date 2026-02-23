const { json } = require("body-parser");
const { Usuario, sequelize } = require("../models");
const { Admin } = require("../models");
const { Vecino } = require("../models");
const { Reserva } = require("../models");
const { Espacio } = require("../models");
const bcrypt=require("bcryptjs");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');

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
            return res.status(404).json({error: "No existe esta reserva"})
        }

        return res.status(200).json(reserva); 
}

const getReservasByUsuarioId = async (req, res) => {
    try {
        const {usuarioId} = req.params

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0)

        const reservas = await Reserva.findAll({ where: { 
            usuarioId, 
            fecha: {
                [Op.gte]: hoy
            }, 
        }, include: [
                {
                    model: Espacio,
                    as: "espacio",
                    attributes: ["nombre","descripcion"],
                },
            ],
            order: [['fecha', 'ASC']]
    });

    if(!reservas){
        return res.status(404).json({error: "Este usuario no tiene reservas"})
    }

        return res.status(200).json(reservas)
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

const getReservasPasadas = async (req, res) => {
    try {
        const {usuarioId} = req.params

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0)

        const reservas = await Reserva.findAll({ where: { 
            usuarioId, 
            fecha: {
                [Op.lt]: hoy
            }, 
        }, include: [
                {
                    model: Espacio,
                    as: "espacio",
                    attributes: ["nombre","descripcion"],
                },
            ],
            order: [['fecha', 'ASC']]
    });

    if(!reservas){
        return res.status(404).json({error: "Este usuario no tiene reservas"})
    }

        return res.status(200).json(reservas)
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

const deleteReserva = async (req,res) => {
    try {
        const {id} = req.params

        const reserva = await Reserva.findOne({where: {id}})

        if(!reserva){
            return res.status(404).json({error: "No existe esta reserva"})
        }

         await reserva.destroy();

        return res.status(200).json({ message: "Reserva eliminada correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "error al eliminar la reserva"});
    }
}

const updateReserva = async (req,res) => {
    try {
        const {id} = req.params
        const {fecha, horaInicio, horaFin, cantidadPersonas} = req.body;

        const reserva = await Reserva.findByPk(id);
        if(!reserva){
            return res.status(404).json({ message: "Reserva no encontrada"});
        }

        if(fecha) reserva.fecha = fecha
        if(horaInicio) reserva.horaInicio = horaInicio
        if(horaFin) reserva.horaFin = horaFin
        if(cantidadPersonas) reserva.cantidadPersonas = cantidadPersonas

        await reserva.save();

        return res.status(200).json({message: "Reserva actualizada correctamente"})
    } catch (error) {
        console.error('Error al actualizar reserva: ', error);
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    createReserva,
    getReservas,
    getReservaById,
    getReservasByUsuarioId,
    getReservasPasadas,
    deleteReserva,
    updateReserva
};