const { Conjunto } = require("../models");

const createConjunto = async (req, res) => {
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

const getConjuntos = async (req, res) => {
    try {
        const conjuntos = await Conjunto.findAll();

        return res.status(200).json(conjuntos);
    } catch (error) {
        return res.status(404).json({error: "Conjuntos no encontrados"})
    }
}

module.exports = { createConjunto, getConjuntos}