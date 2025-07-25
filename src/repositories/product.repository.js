// src/repositories/product.repository.js
import { ProductDAO } from '../dao/product.dao.js';

const productDAO = new ProductDAO();

export class ProductRepository {
  async createProduct(data) {
    return await productDAO.create(data);
  }

  async getAllProducts() {
    return await productDAO.findAll();
  }

  async getProductByCodigo(codigo) {
    return await productDAO.findByCodigo(codigo);
  }

  async updateProduct(codigo, data) {
    return await productDAO.updateByCodigo(codigo, data);
  }

  async deleteProduct(codigo) {
    return await productDAO.deleteByCodigo(codigo);
  }
}
