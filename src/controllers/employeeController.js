const employeeModel = require("../models/employeeModel");

// Crear un nuevo empleado
const crearEmpleado = async (req, res) => {
  try {
    const { name, puntuacion } = req.body;
    const image = req.file;

    if (!image) {
      return res
        .status(400)
        .json({ mensaje: "Se requiere una imagen para el empleado" });
    }

    // Crear los datos del empleado (sin la URL de la imagen)
    const empleadoData = {
      name,
      puntuacion: parseFloat(puntuacion),
    };

    // Crear el empleado en el modelo, pasándole también la imagen
    const nuevoEmpleado = await employeeModel.createEmployee(empleadoData, image);

    // Responder con el empleado creado
    res.status(201).json({
      mensaje: "Empleado creado con éxito",
      empleadoData: nuevoEmpleado,
    });
  } catch (error) {
    console.error("Error creando empleado:", error);
    res.status(500).json({ mensaje: "Error creando empleado" });
  }
};

// Obtener todos los empleados
const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await employeeModel.getAllEmployees();

    if (empleados.length === 0) {
      return res.status(404).json({ mensaje: "No hay empleados disponibles" });
    }

    res.status(200).json(empleados);
  } catch (error) {
    console.error("Error obteniendo empleados:", error);
    res.status(500).json({ mensaje: "Error obteniendo empleados" });
  }
};

// Obtener un empleado por su ID
const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const { id } = req.params; // El ID del empleado se pasa como parámetro en la URL

    const empleado = await employeeModel.getEmployeeById(id);

    if (!empleado) {
      return res.status(404).json({ mensaje: "Empleado no encontrado" });
    }

    res.status(200).json(empleado);
  } catch (error) {
    console.error("Error obteniendo empleado por ID:", error);
    res.status(500).json({ mensaje: "Error obteniendo empleado por ID" });
  }
};

module.exports = {
  crearEmpleado,
  obtenerEmpleados,
  obtenerEmpleadoPorId,
};
