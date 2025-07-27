import { Ticket } from '../models/ticket.model.js';
import { ticketDTO } from '../dtos/ticket.dto.js';

// 🔹 Tickets del usuario autenticado
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user._id;
    const tickets = await Ticket.find({ comprador: userId })
      .populate('productos.productoId')
      .populate('comprador', 'name email address phone');

    res.status(200).json({
      message: 'Historial de tickets del usuario',
      tickets: tickets.map(ticketDTO)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los tickets', error: error.message });
  }
};

// 🔹 Tickets globales para el admin
export const getHistorialTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('productos.productoId', 'nombreComercial precio')
      .populate('comprador', 'name email address phone');

    res.status(200).json({
      message: 'Historial completo de tickets',
      tickets: tickets.map(ticketDTO)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial de tickets', error: error.message });
  }
};

// 🔹 Pedidos pendientes para el admin
export const getPedidosPendientes = async (req, res) => {
  try {
    const pendientes = await Ticket.find({ estado: 'pendiente' })
      .populate('productos.productoId', 'nombreComercial precio')
      .populate('comprador', 'name email address phone');

    res.status(200).json({
      message: 'Pedidos pendientes',
      tickets: pendientes.map(ticketDTO)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos pendientes', error: error.message });
  }
};

// 🔹 Marcar un pedido como surtido (por código)
export const marcarPedidoSurtido = async (req, res) => {
  try {
    const { codigo } = req.params;
    const ticket = await Ticket.findOne({ codigo });

    if (!ticket) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    ticket.estado = 'surtido';
    await ticket.save();

    res.status(200).json({
      message: 'Pedido marcado como surtido',
      ticket: ticketDTO(ticket)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado del pedido', error: error.message });
  }
};