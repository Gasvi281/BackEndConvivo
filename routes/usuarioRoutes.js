const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuarioController");
const authService = require("../services/authService");
const rolService = require("../services/rolService");
const usuario = require("../models/usuario");

router.post("/crearUsuario", UsuarioController.createUsuario);
router.get("/verUsuarios", authService, rolService(["administrador", "vecino"]), UsuarioController.getUsuarios);
router.get("/verUsuario/:id", authService, UsuarioController.getUsuario)

module.exports = router;
