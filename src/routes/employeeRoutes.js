const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const employeeController = require("../controllers/employeeController"); // Importa el controlador de empleados
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
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos permitidos
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Transformaciones opcionales
  }
});

const upload = multer({ storage: storage });

// Ruta para crear un nuevo empleado
router.post("/empleado", upload.single("image"), employeeController.crearEmpleado);

// Obtener todos los empleados
router.get("/empleados", employeeController.obtenerEmpleados);

// Obtener un empleado por ID
router.get("/empleado/:id", employeeController.obtenerEmpleadoPorId);

module.exports = router;
