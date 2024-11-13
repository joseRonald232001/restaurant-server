const db = require("../config/firebase");
const cloudinary = require("cloudinary").v2;

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Subir imagen de empleado a Cloudinary
const uploadImageToCloudinary = async (imagePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: "empolyees",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });
    return uploadResult.secure_url;
  } catch (error) {
    throw new Error("Error uploading image to Cloudinary");
  }
};

// Crear un nuevo empleado
const createEmployee = async (employeeData, image) => {
  try {
    // Subir la imagen
    const imageUrl = await uploadImageToCloudinary(image.path);

    // Crear un ID único para el empleado
    const employeeId = db.collection("employees").doc().id;


    const employee = {
      name: employeeData.name,
      image: imageUrl,
      qualityOfService: parseFloat(employeeData.qualityOfService),
    };

    // Guardar en Firestore
    await db.collection("employees").doc(employeeId).set(employee);

    return { employeeId, ...employee };
  } catch (error) {
    throw new Error("Error creating employee: " + error.message);
  }
};

// Obtener todos los empleados
const getAllEmployees = async () => {
  try {
    const employeesSnapshot = await db.collection("employees").get();
    const employees = [];

    employeesSnapshot.forEach((doc) => {
      employees.push({ id: doc.id, ...doc.data() });
    });

    return employees;
  } catch (error) {
    throw new Error("Error fetching employees: " + error.message);
  }
};

// Obtener un empleado por su ID
const getEmployeeById = async (id) => {
  try {
    const employeeDoc = await db.collection("employees").doc(id).get();

    if (!employeeDoc.exists) {
      throw new Error("Employee not found");
    }

    return { id: employeeDoc.id, ...employeeDoc.data() };
  } catch (error) {
    throw new Error("Error fetching employee by ID: " + error.message);
  }
};

module.exports = { createEmployee, getAllEmployees, getEmployeeById };
