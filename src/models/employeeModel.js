const { v4: uuidv4 } = require("uuid");
const db = require("../config/firebase");

// Crear nuevo empleado
const createEmployee = async (employeeData, image) => {
  try {
    const employeeId = uuidv4();
    const employeeDataWithImage = {
      ...employeeData,
      image: image.path,  // Guardar la ruta de la imagen
    };
    await db.collection("empleados").doc(employeeId).set(employeeDataWithImage);

    return { employeeId, ...employeeDataWithImage };
  } catch (error) {
    throw new Error("Error creando empleado: " + error.message);
  }
};

// Obtener todos los empleados
const getAllEmployees = async () => {
  try {
    const empleadosSnapshot = await db.collection("empleados").get();
    const empleados = [];

    empleadosSnapshot.forEach((doc) => {
      empleados.push({ id: doc.id, ...doc.data() });
    });

    return empleados;
  } catch (error) {
    throw new Error("Error obteniendo empleados: " + error.message);
  }
};

// Obtener un empleado por su ID
const getEmployeeById = async (id) => {
  try {
    const empleadoDoc = await db.collection("empleados").doc(id).get();

    if (!empleadoDoc.exists) {
      throw new Error("Empleado no encontrado");
    }

    return { id: empleadoDoc.id, ...empleadoDoc.data() };
  } catch (error) {
    throw new Error("Error obteniendo empleado por ID: " + error.message);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
};
