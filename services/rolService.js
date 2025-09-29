const rolService = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.cuenta) {
      return res.status(401).json({ error: "No autenticado" });
    }

    if (!rolesPermitidos.includes(req.cuenta.rol)) {
      return res.status(403).json({ error: "No autorizado" });
    }

    next();
  };
};

module.exports = rolService;
