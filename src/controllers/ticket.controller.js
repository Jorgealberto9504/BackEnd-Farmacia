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

// 🔹 Tickets globales para el admin (soporta filtros opcionales por fecha o rango)
export const getHistorialTickets = async (req, res) => {
  try {
    const { fecha, inicio, fin } = req.query;
    let filtro = {};

    if (fecha) {
      const start = new Date(fecha);
      start.setHours(0, 0, 0, 0);
      const end = new Date(fecha);
      end.setHours(23, 59, 59, 999);
      filtro.createdAt = { $gte: start, $lte: end };
    }

    if (inicio && fin) {
      const start = new Date(inicio);
      start.setHours(0, 0, 0, 0);
      const end = new Date(fin);
      end.setHours(23, 59, 59, 999);
      filtro.createdAt = { $gte: start, $lte: end };
    }

    const tickets = await Ticket.find(filtro)
      .populate('productos.productoId', 'nombreComercial precio')
      .populate('comprador', 'name email address phone');

    res.status(200).json({
      message: 'Historial filtrado de tickets',
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

// 🔹 Crear un nuevo pedido (con emisión de evento WebSocket)
export const crearPedido = async (req, res) => {
  try {
    const nuevoPedido = await Ticket.create(req.body);

    // ✅ Emitir evento en tiempo real a todos los clientes conectados
    req.io.emit("pedidoNuevo", ticketDTO(nuevoPedido));
    console.log("🔔 Evento pedidoNuevo emitido desde checkout:", ticketDTO(ticketCreado));

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      ticket: ticketDTO(nuevoPedido)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el pedido', error: error.message });
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

    // ✅ Emitir evento en tiempo real al actualizar pedido
    req.io.emit("pedidoActualizado", ticketDTO(ticket));

    res.status(200).json({
      message: 'Pedido marcado como surtido',
      ticket: ticketDTO(ticket)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado del pedido', error: error.message });
  }
};

// 🔹 Buscar pedidos surtidos por rango de fechas
export const getPedidosPorRango = async (req, res) => {
  try {
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
      return res.status(400).json({ message: 'Debes proporcionar fecha de inicio y fin' });
    }

    const fechaInicio = new Date(inicio);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(fin);
    fechaFin.setHours(23, 59, 59, 999);

    const tickets = await Ticket.find({
      estado: 'surtido',
      $or: [
        { fecha: { $gte: fechaInicio, $lte: fechaFin } },
        { createdAt: { $gte: fechaInicio, $lte: fechaFin } }
      ]
    })
      .populate('productos.productoId', 'nombreComercial precio')
      .populate('comprador', 'name email address phone');

    res.status(200).json({
      message: 'Pedidos surtidos en el rango',
      tickets: tickets.map(ticketDTO)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar pedidos por rango', error: error.message });
  }
};