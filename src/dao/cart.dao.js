import { Cart } from '../models/cart.model.js';

export class CartDAO {
  async findByUserId(userId) {
    return await Cart.findOne({ usuario: userId }).populate('productos.productoId');
  }

  async createCart(userId) {
    return await Cart.create({ usuarioId: userId, productos: [] });
  }

  async updateCart(cart) {
    return await cart.save();
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ usuario: userId });
    if (cart) {
      cart.productos = [];
      return await cart.save();
    }
    return null;
  }
}