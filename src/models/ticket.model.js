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
  fecha: {
    type: Date,
    default: Date.now
  }
});

export const Ticket = mongoose.model('Ticket', ticketSchema);
