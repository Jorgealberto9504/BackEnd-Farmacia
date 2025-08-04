import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { Ticket } from '../models/ticket.model.js';
import { Cart } from '../models/cart.model.js';
import { sendRecoveryEmail } from '../services/mailer.service.js';
import { User } from '../models/user.model.js';

const cartRepo = new CartRepository();
const productRepo = new ProductRepository();

// ✅ Generar código de ticket
function generarCodigoTicket() {
  return 'TCK-' + Date.now();
}

// ✅ Agregar producto al carrito
export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { codigo } = req.params;

  try {
    console.log("Código recibido:", codigo);
    const product = await productRepo.getProductByCodigo(codigo);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const cart = await cartRepo.getUserCart(userId);
    await cartRepo.addProductToCart(cart, product._id);

    const updatedCart = await Cart.findOne({ usuarioId: userId })
      .populate('productos.productoId', 'nombreComercial codigo precio');

    res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ message: 'Error al agregar producto', error: error.message });
  }
};

// ✅ Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { codigo } = req.params;

  try {
    const product = await productRepo.getProductByCodigo(codigo);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const cart = await cartRepo.getUserCart(userId);
    await cartRepo.removeProductFromCart(cart, product._id);

    const updatedCart = await Cart.findOne({ usuarioId: userId })
      .populate('productos.productoId', 'nombreComercial codigo precio');

    res.status(200).json({ message: 'Producto eliminado del carrito', cart: updatedCart });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};

// ✅ Ver carrito
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

// ✅ Finalizar compra con evento WebSocket
export const purchaseCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ usuarioId: userId }).populate('productos.productoId');
    if (!cart || cart.productos.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    const userData = await User.findById(userId).lean();
    let total = 0;
    const productosFinal = [];

    for (const item of cart.productos) {
      const product = item.productoId;
      if (!product) continue;

      if (product.stock >= item.cantidad) {
        product.stock -= item.cantidad;
        await product.save();

        total += product.precio * item.cantidad;

        // ✅ Guardar también el nombreBackup
        productosFinal.push({
          productoId: product._id,
          nombreBackup: product.nombreComercial,
          cantidad: item.cantidad
        });
      } else {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.nombreComercial}`
        });
      }
    }

    // ✅ Crear ticket con nombreBackup
    const newTicket = await Ticket.create({
      codigo: generarCodigoTicket(),
      comprador: userId,
      productos: productosFinal,
      total,
      estado: 'pendiente'
    });

    // ✅ Emitir evento WebSocket con nombre incluido
    if (req.io) {
      req.io.emit("pedidoNuevo", {
        codigo: newTicket.codigo,
        comprador: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address
        },
        productos: productosFinal.map(p => ({
          productoId: p.productoId,
          nombre: p.nombreBackup,      // 🔥 nombre disponible en tiempo real
          cantidad: p.cantidad
        })),
        total,
        estado: newTicket.estado
      });
      console.log("🔔 Evento pedidoNuevo emitido con nombres correctos:", newTicket.codigo);
    }

    // ✅ Vaciar carrito
    await cart.deleteOne({ _id: cart._id });

    // ✅ Correos usando nombreBackup
    const htmlUser = `
      <h2>✅ Gracias por su compra, ${userData.name}</h2>
      <p>Su pedido ha sido recibido y está en preparación.</p>
      <p><b>Total:</b> $${total.toFixed(2)}</p>
      <p><b>Código de ticket:</b> ${newTicket.codigo}</p>
      <h3>🛒 Productos:</h3>
      <ul>
        ${productosFinal.map(p => `<li>${p.nombreBackup} - Cantidad: ${p.cantidad}</li>`).join('')}
      </ul>
    `;

    const htmlAdmin = `
      <h2>📦 Nuevo pedido recibido</h2>
      <p><b>Cliente:</b> ${userData.name}</p>
      <p><b>Email:</b> ${userData.email}</p>
      <p><b>Teléfono:</b> ${userData.phone}</p>
      <p><b>Dirección:</b> ${userData.address}</p>
      <p><b>Total:</b> $${total.toFixed(2)}</p>
      <p><b>Código de ticket:</b> ${newTicket.codigo}</p>
      <h3>🛒 Productos:</h3>
      <ul>
        ${productosFinal.map(p => `<li>${p.nombreBackup} - Cantidad: ${p.cantidad}</li>`).join('')}
      </ul>
    `;

    await sendRecoveryEmail(userData.email, `Gracias por su compra - ${newTicket.codigo}`, htmlUser);
    await sendRecoveryEmail(process.env.ADMIN_EMAIL, `Nuevo pedido de ${userData.name} - ${newTicket.codigo}`, htmlAdmin);

    res.status(200).json({ message: 'Compra realizada con éxito', ticket: newTicket });
  } catch (error) {
    console.error("Error en la compra:", error);
    res.status(500).json({ message: 'Error en la compra', error: error.message });
  }
};