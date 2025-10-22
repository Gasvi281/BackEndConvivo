const { json } = require("body-parser");
const { Usuario, sequelize } = require("../models");
const { Admin } = require("../models");
const { Vecino } = require("../models");
const { Conjunto } = require("../models");
const bcrypt=require("bcryptjs");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");

const createEspacio = async(req, res) => {
    try {
        const { nombreConjunto,
            direccion,
            ciudad, 
            numeroApartamentos
        } = req.body;

        const conjunto = await Conjunto.create({
            nombreConjunto,
            direccion,
            ciudad,
            numeroApartamentos
        });

        return res.status(201).json(conjunto);
    } catch (error) {
        console.log("Error creando el conjunto", error);
        return res.status(500).json({ error: error.message || error.toString() })
    }
}

module.exports = {
    createEspacio,
};