const express = require("express");
const router = express.Router();
const ConjuntoController = require("../controllers/conjuntoController");
const authService = require("../services/authService");

router.post("/create", ConjuntoController.createConjunto);
router.get("/get", ConjuntoController.getConjuntos);

module.exports = router;