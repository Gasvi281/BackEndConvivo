const { json } = require("body-parser");
const { Usuario } = require("../models");

const createUsuario = async(req, res) => {
    try {
        const { nombreCompleto,
            correo,
            password
        } = req.body;

        const usuario = await Usuario.create({
            nombreCompleto,
            correo, 
            password,
        })

        console.log("Usuario creado con id: ", usuario.id);

        return res.status(201).json(usuario);
    } catch (error) {
        console.log("Error agregando el usuario", error);
        return res.status(500).json({ error: error.message || error.toString() })
    }
}

const getUsuarios = async(req, res)=>{
    try {
        const usuarios = await Usuario.findAll();
        
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(404).json({error: "usuarios no encontrados"})
    }
}

module.exports = {
    createUsuario,
    getUsuarios
};