// src/dtos/ticket.dto.js
export const ticketDTO = (ticket) => {
  return {
    _id: ticket._id,                      // ✅ necesario para marcar surtido por ID
    codigo: ticket.codigo,
    fecha: ticket.fecha,
    total: ticket.total,
    estado: ticket.estado,                // ✅ ahora se envía al frontend
    comprador: ticket.comprador ? {       // ✅ incluimos info del cliente
      name: ticket.comprador.name,
      email: ticket.comprador.email,
      address: ticket.comprador.address,
      phone: ticket.comprador.phone
    } : null,
    productos: ticket.productos.map(p => ({
      productoId: p.productoId,
      cantidad: p.cantidad
    }))
  };
};