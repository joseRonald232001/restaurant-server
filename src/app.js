require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const productoRoutes = require("./routes/productoRoutes"); 
const employeeRoutes = require("./routes/employeeRoutes");
const app = express();
const port = process.env.PORT || 3000;
// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(cors());

// Usar las rutas de productos
app.use("/api", productoRoutes);
app.use("/api", employeeRoutes);

app.get("/", (req, res) => {
  res.send("¡Hola, mundo!");
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
