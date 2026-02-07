const express = require("express");
const router = express.Router();
const ReservaController = require("../controllers/reservaController");

router.post("/create", ReservaController.createReserva);
router.get("/get", ReservaController.getReservas);
router.get("/get/:id", ReservaController.getReservaById);
router.get("/getU/:usuarioId", ReservaController.getReservasByUsuarioId);
router.delete("/delete/:id", ReservaController.deleteReserva);
router.put("/update/:id", ReservaController.updateReserva)
module.exports = router;