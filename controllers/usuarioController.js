const { json } = require("body-parser");
const { Usuario, sequelize } = require("../models");
const { Admin } = require("../models");
const { Vecino } = require("../models");
const { Conjunto } = require("../models");
const bcrypt=require("bcryptjs");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");

const createUsuario = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const { nombreCompleto,
            correo,
            password,
            rol
        } = req.body;

        const conjuntoId = req.body.conjuntoId;

        const existeC = await Conjunto.findByPk(conjuntoId);

        if(!existeC){
            return res.status(404).json({error: "Este conjunto no existe"})
        }

        const numeroApartamento = req.body.numeroApartamento || '';
        const telefono = req.body.telefono || '';

        const existe = await Usuario.findOne({where: {correo}})

        if(existe){
            return res.status(400).json({error: "Correo ya existe"})
        }

        const usuario = await Usuario.create({
            nombreCompleto,
            correo, 
            password,
            rol
        }, { transaction: t});

        let detalle = null;

        if(usuario.rol === "administrador"){
            detalle = await Admin.create({
                id: usuario.id,
                conjuntoId: conjuntoId,
                telefono: telefono
            }, { transaction: t})

            console.log("administrador creado con id: ", detalle.id);
        } else{
            detalle = await Vecino.create({
                id: usuario.id,
                conjuntoId: conjuntoId,
                numeroApartamento: numeroApartamento
            }, { transaction: t})

            console.log("vecino creado con id: ", detalle.id);
            
        }

        console.log("Usuario creado con id: ", usuario.id);

        await t.commit();
        return res.status(201).json({usuario, detalle });
    } catch (error) {
        await t.rollback();
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

const getUsuarioByCorreo = async(req, res)=>{
    try {
        const {correo} = req.params
        const usuario = await Usuario.findOne({where: {correo}})
        if (!usuario){
            return res.status(404).json({error: "Usuario no encontrado"})
        }

        return res.status(200).json(usuario)
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}

const getUsuario = async (req, res)=> {
    try {
        const {id} = req.params;
        const usuario = await Usuario.findByPk(id)
        if (!usuario){
            return res.status(404).json({error: "Usuario no encontrado"})
        }

        let detalle = null;

        if(usuario.rol === "administrador"){
            detalle = await Admin.findByPk(id, {
                include: [
                    {
                        model: Conjunto,
                        as: "conjunto",
                        attributes: ["nombreConjunto"],
                    },
                ],
            })
        } else {
            detalle = await Vecino.findByPk(id, {
                include: [
                    {
                        model: Conjunto,
                        as: "conjunto",
                        attibutes: ["nombreConjunto"],
                    },
                ],
            })
        }

        return res.status(200).json({usuario, detalle})
    } catch (error) {
        return res.status(500).json({error: error.message})

    }
}

const changePassword = async (req, res)=> {
    try{
        const {token}=req.body
        const {newPassword}= req.body
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario= await Usuario.findOne({where: {correo: decoded.correo}})

        if (!usuario){
            return res.status(404).json({error:"Usuario no encontrado"})
        }

        usuario.password = await bcrypt.hash(newPassword, 10)
        await usuario.save()

        return res.status(200).json(usuario)

    } catch{
        return res.status(400).json({error: "Token invalido o expirado"})
    }

} 

module.exports = {
    createUsuario,
    getUsuarios,
    getUsuario,
    getUsuarioByCorreo,
    changePassword
};