const express = require("express");
const router = express.Router();
const ComentarioController = require("../controllers/comentarioController");
const authService = require("../services/authService");

router.post("/create", authService, ComentarioController.createComentario);
router.get("/get", authService, ComentarioController.getComentarios);
router.get("/get/:id", authService, ComentarioController.getComentarioById);
router.get("/getU/:usuarioId", authService, ComentarioController.getComentariosByUsuarioId);
module.exports = router;