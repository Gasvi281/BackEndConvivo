const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/reset-password", authController.enviarCorreoReset);

module.exports = router;