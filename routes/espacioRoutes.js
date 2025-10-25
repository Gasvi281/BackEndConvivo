const express = require("express");
const router = express.Router();
const EspacioController = require("../controllers/espacioController");

router.post("/create", EspacioController.createEspacio);
router.get("/get", EspacioController.getEspacios);
router.get("/getUno/:id", EspacioController.getEspacioById)
router.get("/get/:conjuntoId", EspacioController.getEspaciosByConjuntoId)
router.get("/getActive/:conjuntoId", EspacioController.getEspaciosActivosByConjuntoId)

module.exports = router;