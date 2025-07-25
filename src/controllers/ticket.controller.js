import { Ticket } from '../models/ticket.model.js';
import { ticketDTO } from '../dtos/ticket.dto.js';

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
