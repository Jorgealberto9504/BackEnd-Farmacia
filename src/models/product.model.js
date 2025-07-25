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
  tipoVenta: { type: String, enum: ['Libre', 'Con receta'], required: true },
  laboratorio: { type: String, required: true },
  imagen: { type: String, default: '' },
  estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
