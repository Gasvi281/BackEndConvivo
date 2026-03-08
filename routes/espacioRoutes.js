const express = require("express");
const router = express.Router();
const EspacioController = require("../controllers/espacioController");
const authService = require("../services/authService");

router.post("/create", authService, EspacioController.createEspacio);
router.get("/get", authService, EspacioController.getEspacios);
router.get("/getUno/:id", authService, EspacioController.getEspacioById)
router.get("/get/:conjuntoId", authService, EspacioController.getEspaciosByConjuntoId)
router.get("/getActive/:conjuntoId", authService, EspacioController.getEspaciosActivosByConjuntoId)
router.put("/update/:id", authService, EspacioController.updateEspacio)

module.exports = router;