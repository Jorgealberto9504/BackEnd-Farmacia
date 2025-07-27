import { Ticket } from '../models/ticket.model.js';
import { ticketDTO } from '../dtos/ticket.dto.js';

// 🔹 Tickets del usuario autenticado
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user._id;

    const tickets = await Ticket.find({ comprador: userId })
      .populate('productos.productoId')
      .populate('comprador', 'name email address phone');

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

// 🔹 Tickets globales para el admin
export const getHistorialTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('productos.productoId', 'nombreComercial precio')
      .populate('comprador', 'name email address phone');

    const cleanTickets = tickets.map(ticketDTO);

    res.status(200).json({
      message: 'Historial completo de tickets',
      tickets: cleanTickets
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el historial de tickets',
      error: error.message
    });
  }
};