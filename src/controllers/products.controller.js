// src/controllers/products.controller.js
import { ProductRepository } from '../repositories/product.repository.js';
import { productDTO } from '../dtos/product.dto.js';


const productRepo = new ProductRepository();

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

    // Validación de campos obligatorios
    if (
      !nombreComercial || !sustanciaActiva || !descripcion ||
      !precio || !codigo || !stock || !categoria ||
      !tipoVenta || !laboratorio
    ) {
      return res.status(400).json({
        message: 'Todos los campos obligatorios deben estar completos.'
      });
    }

    // Verificar si ya existe un producto con el mismo código
    const existing = await productRepo.getProductByCodigo(codigo);
    if (existing) {
      return res.status(409).json({
        message: 'Ya existe un producto con este código.'
      });
    }

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

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el producto',
      error: error.message
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await productRepo.getAllProducts();

    const safeProducts = products.map(product => productDTO(product));

    res.status(200).json({
      message: 'Lista de productos',
      products: safeProducts
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

export const updateProductByCodigo = async (req, res) => {
  const { codigo } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await productRepo.updateProduct(codigo, updateData);

    if (!updatedProduct) {
      return res.status(404).json({
        message: `No se encontró ningún producto con código ${codigo}`
      });
    }

    res.status(200).json({
      message: 'Producto actualizado exitosamente',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el producto',
      error: error.message
    });
  }
};

export const deleteProductByCodigo = async (req, res) => {
  const { codigo } = req.params;

  try {
    const deletedProduct = await productRepo.deleteProduct(codigo);

    if (!deletedProduct) {
      return res.status(404).json({
        message: `No se encontró ningún producto con código ${codigo}`
      });
    }

    res.status(200).json({
      message: 'Producto eliminado exitosamente',
      product: deletedProduct
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar el producto',
      error: error.message
    });
  }
};
