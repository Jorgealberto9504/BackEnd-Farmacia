import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Un carrito activo por usuario
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
        required: true,
        default: 1
      }
    }
  ],
  estado: {
    type: String,
    enum: ['activo', 'comprado'],
    default: 'activo'
  }
}, { timestamps: true });

export const Cart = mongoose.model('Cart', cartSchema);
