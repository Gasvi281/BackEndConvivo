const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const ComentarioController = require("../controllers/comentarioController");
const authService = require("../services/authService");



router.post("/create", authService, upload.array("adjuntos", 5), ComentarioController.createComentario);
router.get("/get", authService, ComentarioController.getComentarios);
router.get("/get/:id", authService, ComentarioController.getComentarioById);
router.get("/getU/:usuarioId", authService, ComentarioController.getComentariosByUsuarioId);
router.get("/getL/:usuarioId", authService, ComentarioController.getComentariosLigadosByUsuarioId);
router.get("/getA/:conjuntoId", authService, ComentarioController.getAnunciosByConjuntoId);
router.delete("/delete/:id", authService, ComentarioController.deleteComentario);
router.delete("/delete/adjunto/:id/:nombreArchivo", authService, ComentarioController.deleteAdjunto);
module.exports = router;