// src/dao/product.dao.js
import { Product } from '../models/product.model.js';

export class ProductDAO {
  async create(productData) {
    return await Product.create(productData);
  }

  async findAll() {
    return await Product.find({ estado: 'activo' });
  }

  async findByCodigo(codigo) {
    return await Product.findOne({ codigo });
  }

  async updateByCodigo(codigo, updateData) {
    return await Product.findOneAndUpdate({ codigo }, updateData, {
      new: true,
      runValidators: true
    });
  }

  async deleteByCodigo(codigo) {
    return await Product.findOneAndDelete({ codigo });
  }
}
