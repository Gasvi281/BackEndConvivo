const { Usuario } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async(req, res) => {
    try {
        const {correo, password} = req.body;

        const usuario = await Usuario.findOne({where: {correo}})
        
        if(!usuario){
            return res.status(404).json({error: "Usuario no encontrado"})
        }

        const isCorrectPassword = await bcrypt.compare(password, usuario.password);
        if(!isCorrectPassword){
            return res.status(401).json({error: "Contraseña incorrecta"})
        }

        const token = jwt.sign(
            { id: usuario.id, nombreCompleto: usuario.nombreCompleto, rol: usuario.rol},
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );

        return res.json({ token, id: usuario.id})


    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

module.exports = { login }