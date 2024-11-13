const { v4: uuidv4 } = require("uuid");
const db = require("../config/firebase");

// Crear nuevo producto producto
const createProduct = async (productData, image) => {
  try {
    const productoId = uuidv4();
    const productoData = {
      ...productData,
      image: image.path, 
    };
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
      .where("category", "==", category) 
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

module.exports = {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getProductById,
};
