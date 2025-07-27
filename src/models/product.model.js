// src/models/product.model.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombreComercial: { type: String, required: true },
  sustanciaActiva: { type: String, required: true },
  descripcion: { type: String, required: true }, // Ej. "Caja con 10 tabletas de 500mg"
  precio: { type: Number, required: true },
  codigo: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  categoria: { type: String, required: true }, // Ej. "Antibiótico"
// En product.model.js
tipoVenta: {
  type: String,
  enum: ["Libre", "Receta"],
  required: true,
  set: (v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() // 🔥 normaliza
},  laboratorio: { type: String, required: true },
  imagen: { type: String, default: '' },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
