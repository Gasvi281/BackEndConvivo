const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/reservaController");
const authService = require("../services/authService")

router.post("/create", authService, ReservaController.createReserva);
router.get("/get", authService, ReservaController.getReservas);
router.get("/get/:id", authService, ReservaController.getReservaById);
router.get("/getU/:usuarioId", authService, ReservaController.getReservasByUsuarioId);
router.get("/getP/:usuarioId", authService, ReservaController.getReservasPasadas)
router.delete("/delete/:id", authService, ReservaController.deleteReserva);
router.put("/update/:id", authService, ReservaController.updateReserva)
router.patch("/confirm", ReservaController.activateReserva)
module.exports = router;