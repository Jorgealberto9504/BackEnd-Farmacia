// controllers/ticket.controller.js
import { Ticket } from '../models/ticket.model.js';
import { ticketDTO } from '../dtos/ticket.dto.js';

// ✅ Tickets de usuario actual
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user._id;
    const tickets = await Ticket.find({ comprador: userId }).populate('productos.productoId');
    const cleanTickets = tickets.map(ticketDTO);

    res.status(200).json({
      message: 'Historial de tickets del usuario',
      tickets: cleanTickets
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener los tickets',
      error: error.message
    });
  }
};

// ✅ Tickets pendientes (solo admin)
export const getTicketsPendientes = async (req, res) => {
  try {
    const tickets = await Ticket.find({ estado: 'pendiente' })
      .populate('comprador', 'name email address phone')
      .populate('productos.productoId', 'nombreComercial precio');
    
    res.status(200).json({ message: 'Pedidos pendientes', tickets });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos pendientes', error: error.message });
  }
};

// ✅ Marcar pedido como surtido
export const marcarPedidoSurtido = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByIdAndUpdate(id, { estado: 'surtido' }, { new: true });

    if (!ticket) return res.status(404).json({ message: 'Pedido no encontrado' });

    res.status(200).json({ message: 'Pedido marcado como surtido', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar pedido', error: error.message });
  }
};

// ✅ Historial de pedidos surtidos
export const getHistorialTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ estado: 'surtido' })
      .populate('comprador', 'name email address phone')
      .populate('productos.productoId', 'nombreComercial precio');

    res.status(200).json({ message: 'Historial de ventas', tickets });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial', error: error.message });
  }
};