const productoModel = require("../models/productoModel");



// Crear un nuevo producto
const crearProducto = async (req, res) => {
  try {
    const { title, description, category, punctuation, price } = req.body;
    const image = req.file;

    if (!image) {
      return res
        .status(400)
        .json({ mensaje: "Se requiere una imagen para el producto" });
    }

    // Crear los datos del producto (sin la URL de la imagen)
    const productoData = {
      title,
      description,
      category,
      punctuation: parseFloat(punctuation),
      price: parseFloat(price),
    };

    // Crear el producto en el modelo, pasándole también la imagen
    const nuevoProducto = await productoModel.createProduct(productoData, image);

    // Responder con el producto creado
    res.status(201).json({
      mensaje: "Producto creado con éxito",
      productoData: nuevoProducto,
    });
  } catch (error) {
    console.error("Error creando producto:", error);
    res.status(500).json({ mensaje: "Error creando producto" });
  }
};

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const productos = await productoModel.getAllProducts();

    if (productos.length === 0) {
      return res.status(404).json({ mensaje: "No hay productos disponibles" });
    }

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ mensaje: "Error obteniendo productos" });
  }
};


// Obtener productos por categoría
const obtenerProductosPorCategoria = async (req, res) => {
  try {
    const { category } = req.query; // La categoría se pasa como un query parameter

    if (!category) {
      return res
        .status(400)
        .json({ mensaje: "Se debe especificar una categoría" });
    }

    const productos = await productoModel.getProductsByCategory(category);

    if (productos.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No hay productos disponibles en esta categoría" });
    }

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error obteniendo productos por categoría:", error);
    res
      .status(500)
      .json({ mensaje: "Error obteniendo productos por categoría" });
  }
};

// Obtener un producto por su ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params; // El ID del producto se pasa como parámetro en la URL

    const producto = await productoModel.getProductById(id);

    res.status(200).json(producto);
  } catch (error) {
    console.error("Error obteniendo producto por ID:", error);
    res.status(404).json({ mensaje: "Producto no encontrado" });
  }
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProductosPorCategoria,
  obtenerProductoPorId,
};
