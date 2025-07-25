export const ticketDTO = (ticket) => {
    return {
      codigo: ticket.codigo,
      fecha: ticket.fecha,
      total: ticket.total,
      productos: ticket.productos.map(p => ({
        productoId: p.productoId,
        cantidad: p.cantidad
      }))
    };
  };
  