const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuarioController");
const authService = require("../services/authService");
const rolService = require("../services/rolService");

router.post("/crearUsuario", UsuarioController.createUsuario);
router.get("usuarios", authService, rolService(["administrador", "vecino"]), UsuarioController.getUsuarios);

module.exports = router;
