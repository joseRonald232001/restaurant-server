const employeeModel = require("../models/employeeModel");

// Crear un nuevo empleado
const createEmployee = async (req, res) => {
  try {
    const { name, qualityOfService } = req.body;
    const image = req.file; // Imagen subida
    

    if (!image) {
      return res.status(400).json({ message: "An image is required for the employee" });
    }

    const employeeData = {
      name,
      qualityOfService, // Calidad de atención (número decimal)
    };

    // Crear el empleado en el modelo
    const newEmployee = await employeeModel.createEmployee(employeeData, image);

    res.status(201).json({ message: "Employee created successfully", employeeData: newEmployee });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Error creating employee" });
  }
};

// Obtener todos los empleados
const getAllEmployees = async (req, res) => {
  try {
    const employees = await employeeModel.getAllEmployees();

    if (employees.length === 0) {
      return res.status(404).json({ message: "No employees available" });
    }

    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees" });
  }
};

// Obtener un empleado por su ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await employeeModel.getEmployeeById(id);

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    res.status(404).json({ message: "Employee not found" });
  }
};

module.exports = { createEmployee, getAllEmployees, getEmployeeById };
