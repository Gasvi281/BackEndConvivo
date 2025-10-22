const express = require("express");
const router = express.Router();
const EspacioController = require("../controllers/espacioController");

router.post("/create", EspacioController.createEspacio);
router.get("/get", EspacioController.getEspacios);
router.get("/get/:id", EspacioController.getEspacioById)

module.exports = router;