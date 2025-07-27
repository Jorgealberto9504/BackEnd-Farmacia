// ✅ src/controllers/products.controller.js
import { ProductRepository } from '../repositories/product.repository.js';
import { productDTO } from '../dtos/product.dto.js';

const productRepo = new ProductRepository();

// ✅ Crear producto
export const createProduct = async (req, res) => {
  try {
    const {
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
    } = req.body;

    if (
      !nombreComercial || !sustanciaActiva || !descripcion ||
      !precio || !codigo || !stock || !categoria || !tipoVenta || !laboratorio
    ) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben estar completos.' });
    }

    const existing = await productRepo.getProductByCodigo(codigo);
    if (existing) {
      return res.status(409).json({ message: 'Ya existe un producto con este código.' });
    }

    const product = await productRepo.createProduct({
      nombreComercial, sustanciaActiva, descripcion, precio,
      codigo, stock, categoria, tipoVenta, laboratorio, imagen
    });

    res.status(201).json({ message: 'Producto creado exitosamente', product });
  } catch (error) {
    console.error("❌ Error en createProduct:", error);
    res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
};

// ✅ Obtener productos (con DTO para usuarios)
export const getProducts = async (req, res) => {
  try {
    const products = await productRepo.getAllProducts();
    const safeProducts = products.map(product => productDTO(product));

    res.status(200).json({ message: 'Lista de productos', products: safeProducts });
  } catch (error) {
    console.error("❌ Error en getProducts:", error);
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// ✅ Obtener productos completos para Admin
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await productRepo.getAllProducts();
    res.status(200).json({ message: 'Lista completa de productos (admin)', products });
  } catch (error) {
    console.error("❌ Error en getAllProductsAdmin:", error);
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// ✅ Actualizar producto por código
export const updateProductByCodigo = async (req, res) => {
  const { codigo } = req.params;
  try {
    const updatedProduct = await productRepo.updateProduct(codigo, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: `No se encontró ningún producto con código ${codigo}` });
    }
    res.status(200).json({ message: 'Producto actualizado exitosamente', product: updatedProduct });
  } catch (error) {
    console.error("❌ Error en updateProductByCodigo:", error);
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

// ✅ Eliminar producto por código
export const deleteProductByCodigo = async (req, res) => {
  const { codigo } = req.params;
  try {
    const deletedProduct = await productRepo.deleteProduct(codigo);
    if (!deletedProduct) {
      return res.status(404).json({ message: `No se encontró ningún producto con código ${codigo}` });
    }
    res.status(200).json({ message: 'Producto eliminado exitosamente', product: deletedProduct });
  } catch (error) {
    console.error("❌ Error en deleteProductByCodigo:", error);
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};