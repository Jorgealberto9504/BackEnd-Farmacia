import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { Ticket } from '../models/ticket.model.js';


const cartRepo = new CartRepository();
const productRepo = new ProductRepository();

export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { codigo } = req.params;

  try {
    const product = await productRepo.getProductByCodigo(codigo);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const cart = await cartRepo.getUserCart(userId);
    const updatedCart = await cartRepo.addProductToCart(cart, product._id);

    res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar producto', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { codigo } = req.params;

  try {
    const product = await productRepo.getProductByCodigo(codigo);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const cart = await cartRepo.getUserCart(userId);
    const updatedCart = await cartRepo.removeProductFromCart(cart, product._id);

    res.status(200).json({ message: 'Producto eliminado del carrito', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

export const viewCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await cartRepo.getUserCart(userId);
    res.status(200).json({ message: 'Carrito del usuario', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
  }
};


function generarCodigoTicket() {
  return 'TCK-' + Date.now();
}

export const purchaseCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await cartRepo.getUserCart(userId);
    if (!cart || cart.productos.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    let total = 0;
    const productosFinal = [];

    // Verificar stock
    for (const item of cart.productos) {
      const product = await productRepo.getProductByCodigo(item.productoId.codigo);
      if (!product) continue;

      if (product.stock >= item.cantidad) {
        product.stock -= item.cantidad;
        await product.save();

        total += product.precio * item.cantidad;

        productosFinal.push({
          productoId: product._id,
          cantidad: item.cantidad
        });
      } else {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.nombreComercial}`
        });
      }
    }

    // Generar ticket
    const newTicket = await Ticket.create({
      codigo: generarCodigoTicket(),
      comprador: userId,
      productos: productosFinal,
      total
    });

    // Cambiar estado del carrito
    // Eliminar el carrito completamente
     await cart.deleteOne({ _id: cart._id });


    res.status(200).json({
      message: 'Compra realizada con éxito',
      ticket: newTicket
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en la compra', error: error.message });
  }
};