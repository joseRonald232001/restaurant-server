const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const productoController = require("../controllers/productoController");
const router = express.Router();

// Configuración de Cloudinary con las credenciales de tu archivo .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de almacenamiento en Cloudinary con multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'your_folder', // Opcional: carpeta en Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos permitidos, ahora incluyendo webp
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Transformaciones opcionales
  }
});

const upload = multer({ storage: storage });

// Ruta para crear un nuevo producto
router.post("/producto", upload.single("image"), productoController.crearProducto);
// /routes/productoRoutes.js
router.get("/productos", (req, res, next) => {
  console.log("Ruta /productos fue llamada.");
  next();  // Asegúrate de llamar al siguiente middleware
}, productoController.obtenerProductos);

// Ruta para crear un nuevo empleado
router.get("/producto/:id", productoController.obtenerProductoPorId); // Obtener producto por ID

router.get("/productos/categoria", productoController.obtenerProductosPorCategoria); // Obtener productos por categoría

module.exports = router;

