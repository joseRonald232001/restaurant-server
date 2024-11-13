const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del almacenamiento de Multer para Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'employees', // Cambiar a la carpeta que prefieras
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos permitidos
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Opcional: transformación de la imagen
  }
});

const upload = multer({ storage: storage });


// Crear un nuevo empleado
router.post("/employee",upload.single("image"),employeeController.createEmployee);

// Obtener todos los empleados
router.get("/employees", employeeController.getAllEmployees);

// Obtener un empleado por ID
router.get("/employee/:id", employeeController.getEmployeeById);

module.exports = router;
