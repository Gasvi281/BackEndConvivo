const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/reservaController");

router.post("/create", ReservaController.createReserva);
router.get("/get", ReservaController.getReservas);
router.get("/get/:id", ReservaController.getReservaById)

module.exports = router;