// models/ticket.model.js
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  },
  comprador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productos: [
    {
      productoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  estado: { 
    type: String, 
    enum: ['pendiente', 'surtido'], 
    default: 'pendiente'   // ✅ nuevo campo
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

export const Ticket = mongoose.model('Ticket', ticketSchema);