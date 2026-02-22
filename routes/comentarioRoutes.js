const express = require("express");
const router = express.Router();
const ComentarioController = require("../controllers/comentarioController");

router.post("/create", ComentarioController.createComentario);
router.get("/get", ComentarioController.getComentarios);
router.get("/get/:id", ComentarioController.getComentarioById);
router.get("/getU/:usuarioId", ComentarioController.getComentariosByUsuarioId);
module.exports = router;