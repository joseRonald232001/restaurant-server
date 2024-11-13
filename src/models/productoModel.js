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
    // Generar un nombre único para la imagen utilizando el nombre original
    const uniqueName = `${Date.now()}-${imageName}`;

    // Subir la imagen a Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      public_id: uniqueName, // Usar un nombre único para evitar duplicación
      folder: "productos",   // Coloca la imagen en la carpeta 'productos' de Cloudinary
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    console.log(uploadResult.secure_url);  // Verificar la URL generada

    return uploadResult.secure_url; // Retorna la URL segura de la imagen
  } catch (error) {
    throw new Error("Error uploading image to Cloudinary: " + error.message);
  }
};

// Crear un nuevo producto
const createProduct = async (productData, image) => {
  try {
    // Subir la imagen a Cloudinary
    const imageUrl = await uploadImageToCloudinary(image.path, image.originalname); // Pasamos el nombre original de la imagen

    // Crear un ID único para el producto
    const productoId = uuidv4();

    // Preparar los datos del producto con la URL de la imagen
    const productoData = {
      ...productData,
      image: imageUrl, // URL de la imagen subida
    };

    // Guardar el producto en Firestore
    await db.collection("productos").doc(productoId).set(productoData);

    return { productoId, ...productoData }; // Retorna el producto con el ID y la URL de la imagen
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
