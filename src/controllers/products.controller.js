// ✅ src/controllers/products.controller.js
import { ProductRepository } from '../repositories/product.repository.js';
import { productDTO } from '../dtos/product.dto.js';

const productRepo = new ProductRepository();

// ✅ Crear producto con soporte para imagen subida
export const createProduct = async (req, res) => {
  try {
    // ✅ Si multer bloqueó el archivo (extensión no permitida)
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }

    const {
      nombreComercial,
      sustanciaActiva,
      descripcion,
      precio,
      codigo,
      stock,
      categoria,
      tipoVenta,
      laboratorio
    } = req.body;

    // ✅ Validación de campos obligatorios
    if (!nombreComercial || !sustanciaActiva || !descripcion ||
        !precio || !codigo || !stock || !categoria || !tipoVenta || !laboratorio) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben estar completos.' });
    }

    // ✅ Verificar si ya existe el producto
    const existing = await productRepo.getProductByCodigo(codigo);
    if (existing) {
      return res.status(409).json({ message: 'Ya existe un producto con este código.' });
    }

    // ✅ Si hay imagen subida, usa la ruta, si no, asigna vacío
    const imagen = req.file ? `/uploads/products/${req.file.filename}` : "";

    // ✅ Crear producto en BD
    const product = await productRepo.createProduct({
      nombreComercial,
      sustanciaActiva,
      descripcion,
      precio,
      codigo,
      stock,
      categoria,
      tipoVenta,
      laboratorio,
      imagen
    });

    return res.status(201).json({
      message: '✅ Producto creado exitosamente',
      product
    });
  } catch (error) {
    console.error("❌ Error en createProduct:", error);
    return res.status(500).json({
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

// ✅ Obtener productos (usuarios)
export const getProducts = async (req, res) => {
  try {
    const products = await productRepo.getAllProducts();
    res.status(200).json({ message: "Lista de productos", products: products.map(productDTO) });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

// ✅ Obtener productos (admin)
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await productRepo.getAllProducts();
    res.status(200).json({ message: "Lista completa de productos", products });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
};

// ✅ Editar producto y actualizar imagen si se envía nueva
export const updateProductByCodigo = async (req, res) => {
  const { codigo } = req.params;
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imagen = `/uploads/products/${req.file.filename}`;
    }

    const updatedProduct = await productRepo.updateProduct(codigo, updateData);
    if (!updatedProduct) {
      return res.status(404).json({ message: `No se encontró producto con código ${codigo}` });
    }
    res.status(200).json({ message: 'Producto actualizado', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// ✅ Eliminar producto
export const deleteProductByCodigo = async (req, res) => {
  const { codigo } = req.params;
  try {
    const deleted = await productRepo.deleteProduct(codigo);
    if (!deleted) return res.status(404).json({ message: `No se encontró producto con código ${codigo}` });
    res.status(200).json({ message: "Producto eliminado", product: deleted });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error: error.message });
  }
};

// ✅ Endpoint para subir imagen sola
export const subirImagenProducto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No se envió ninguna imagen" });
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ message: "Error al subir imagen", error: error.message });
  }
};