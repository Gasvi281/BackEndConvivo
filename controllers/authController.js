const { Usuario } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { enviarMail } = require("../services/emailService")

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

        return res.json({ token, id: usuario.id, rol: usuario.rol})


    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

const enviarCorreoReset = async(req, res) =>{
    const { correo } = req.body;
    

    try {
        const usuario = await Usuario.findOne({where: {correo}})
        if(!usuario){
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        const tokenReset=jwt.sign(
            {id: usuario.id,
            correo: usuario.correo}, process.env.JWT_SECRET,
            { expiresIn: "10m"}
        )

        const resetLink=`http://localhost:4200/authentication/reset?token=${tokenReset}`

        await enviarMail(usuario.correo, "Recuperacion de contraseña",{resetLink})

        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(500).json(error);
    }
}

const validarToken = async(req, res) => {
    const {token} = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ valido: true, message: "Token autorizado"})
    } catch (error) {
        return res.status(401).json({valid: false, message: "Token expirado"})
    }
}


module.exports = { login, enviarCorreoReset, validarToken }