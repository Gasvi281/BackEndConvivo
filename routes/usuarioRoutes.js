const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuarioController");
const authService = require("../services/authService");
const rolService = require("../services/rolService");

router.post("/crearUsuario", UsuarioController.createUsuario);
router.get("/verUsuarios", authService, rolService(["administrador", "vecino"]), UsuarioController.getUsuarios);
router.get("/verUsuario/:id", authService, UsuarioController.getUsuario)
router.patch("/password", UsuarioController.changePassword)
router.patch("/updateV/:id", authService, UsuarioController.updateUsuarioVecino);
router.patch("/updateA/:id", authService, UsuarioController.updateUsuarioAdmin);
router.get("/verUsuariosConjunto/:conjunto", authService, UsuarioController.getVecinosByConjunto)
module.exports = router;
