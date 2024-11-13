const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
const db = require("../config/firebase");

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Subir imagen a Cloudinary
const uploadImageToCloudinary = async (imagePath, imageName) => {
  try {
    // Generar un nombre único para la imagen
    const uniqueName = `${Date.now()}-${imageName}`;

    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      public_id: uniqueName, // Usar un nombre único para evitar duplicación
      folder: "productos",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    return uploadResult.secure_url;
  } catch (error) {
    throw new Error("Error uploading image to Cloudinary: " + error.message);
  }
};


// Crear un nuevo producto
const createProduct = async (productData, image) => {
  try {
    // Subir la imagen
    const imageUrl = await uploadImageToCloudinary(image.path);

    // Crear un ID único para el producto
    const productoId = uuidv4();

    const productoData = {
      ...productData,
      image: imageUrl, // URL de la imagen subida
    };

    // Guardar en Firestore
    await db.collection("productos").doc(productoId).set(productoData);

    return { productoId, ...productoData };
  } catch (error) {
    throw new Error("Error creating product: " + error.message);
  }
};

// Obtener todos los productos
const getAllProducts = async () => {
  try {
    const productosSnapshot = await db.collection("productos").get();
    const productos = [];
    
    productosSnapshot.forEach((doc) => {
      productos.push({ id: doc.id, ...doc.data() });
    });

    return productos;
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};


// Obtener productos por categoría
const getProductsByCategory = async (category) => {
  try {
    const productosSnapshot = await db
      .collection("productos")
      .where("category", "==", category) // Filtrar por categoría
      .get();

    const productos = [];
    productosSnapshot.forEach((doc) => {
      productos.push({ id: doc.id, ...doc.data() });
    });

    return productos;
  } catch (error) {
    throw new Error("Error fetching products by category: " + error.message);
  }
};

// Obtener un producto por su ID
const getProductById = async (id) => {
  try {
    const productoDoc = await db.collection("productos").doc(id).get();

    if (!productoDoc.exists) {
      throw new Error("Producto no encontrado");
    }

    return { id: productoDoc.id, ...productoDoc.data() };
  } catch (error) {
    throw new Error("Error fetching product by ID: " + error.message);
  }
};

module.exports = { createProduct, getAllProducts, getProductsByCategory, getProductById };
