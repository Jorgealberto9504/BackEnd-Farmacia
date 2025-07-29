// ✅ product.dto.js
export const productDTO = (product) => ({
  nombreComercial: product.nombreComercial,
  sustanciaActiva: product.sustanciaActiva,
  descripcion: product.descripcion,
  precio: product.precio,
  codigo: product.codigo,
  stock: product.stock,
  categoria: product.categoria,
  tipoVenta: product.tipoVenta,
  laboratorio: product.laboratorio,
  imagen: product.imagen ? `http://localhost:8080${product.imagen}` : null
});