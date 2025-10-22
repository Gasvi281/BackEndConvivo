require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const UsuarioRoutes = require("./routes/usuarioRoutes");
const AuthRoutes = require("./routes/authRoutes");
const ConjuntoRoutes = require("./routes/conjuntoRoutes");
const EspacioRoutes = require("./routes/espacioRoutes")

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/usuario", UsuarioRoutes);
app.use("/auth", AuthRoutes);
app.use("/conjunto", ConjuntoRoutes);
app.use("/espacio", EspacioRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})