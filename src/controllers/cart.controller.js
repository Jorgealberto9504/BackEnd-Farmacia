import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { Ticket } from '../models/ticket.model.js';
import { Cart } from '../models/cart.model.js'; // ✅ asegúrate de importar el modelo para populate directo

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();

// ✅ Agregar producto al carrito con populate
export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { codigo } = req.params;

  try {
    console.log("Código recibido:", codigo);
    const product = await productRepo.getProductByCodigo(codigo);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const cart = await cartRepo.getUserCart(userId);
    await cartRepo.addProductToCart(cart, product._id);

    // ✅ recargar carrito populado
    const updatedCart = await Cart.findOne({ usuarioId: userId })
      .populate('productos.productoId', 'nombreComercial codigo precio');

    res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ message: 'Error al agregar producto', error: error.message });
  }
};

// ✅ Eliminar producto del carrito con populate
export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { codigo } = req.params;

  try {
    const product = await productRepo.getProductByCodigo(codigo);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const cart = await cartRepo.getUserCart(userId);
    await cartRepo.removeProductFromCart(cart, product._id);

    // ✅ recargar carrito populado
    const updatedCart = await Cart.findOne({ usuarioId: userId })
      .populate('productos.productoId', 'nombreComercial codigo precio');

    res.status(200).json({ message: 'Producto eliminado del carrito', cart: updatedCart });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

// ✅ Ver carrito con populate
export const viewCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ usuarioId: userId })
      .populate('productos.productoId', 'nombreComercial codigo precio');
    res.status(200).json({ message: 'Carrito del usuario', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
  }
};

// ✅ Generar código de ticket
function generarCodigoTicket() {
  return 'TCK-' + Date.now();
}

// ✅ Finalizar compra con verificación de stock
export const purchaseCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ usuarioId: userId })
      .populate('productos.productoId'); // ✅ populate para acceder a nombreComercial, precio y stock

    if (!cart || cart.productos.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    let total = 0;
    const productosFinal = [];

    // 🔹 Verificar stock y calcular total
    for (const item of cart.productos) {
      const product = item.productoId;
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

    // ✅ Generar ticket
    const newTicket = await Ticket.create({
      codigo: generarCodigoTicket(),
      comprador: userId,
      productos: productosFinal,
      total
    });

    // ✅ Vaciar carrito eliminándolo
    await cart.deleteOne({ _id: cart._id });

    res.status(200).json({
      message: 'Compra realizada con éxito',
      ticket: newTicket
    });
  } catch (error) {
    console.error("Error en la compra:", error);
    res.status(500).json({ message: 'Error en la compra', error: error.message });
  }
};