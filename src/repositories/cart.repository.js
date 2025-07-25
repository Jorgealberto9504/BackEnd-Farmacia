import { CartDAO } from '../dao/cart.dao.js';
const cartDAO = new CartDAO();

export class CartRepository {
  async getUserCart(userId) {
    let cart = await cartDAO.findByUserId(userId);
    if (!cart) {
      cart = await cartDAO.createCart(userId);
    } else {
      await cart.populate('productos.productoId'); // 🔥 asegura que siempre viene el producto
    }
    return cart;
  }

  async addProductToCart(cart, productoId) {
    const existingProduct = cart.productos.find(p => p.productoId.equals(productoId));
    if (existingProduct) {
      existingProduct.cantidad += 1;
    } else {
      cart.productos.push({ productoId, cantidad: 1 });
    }
    return await cartDAO.updateCart(cart);
  }

  async removeProductFromCart(cart, productoId) {
    cart.productos = cart.productos.filter(p => !p.productoId.equals(productoId));
    return await cartDAO.updateCart(cart);
  }

  async clearCart(userId) {
    return await cartDAO.clearCart(userId);
  }
}