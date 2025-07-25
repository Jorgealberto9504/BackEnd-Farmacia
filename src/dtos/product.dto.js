// src/dtos/product.dto.js

export const productDTO = (product) => {
    return {
      nombreComercial: product.nombreComercial,
      sustanciaActiva: product.sustanciaActiva,
      descripcion: product.descripcion,
      precio: product.precio,
      codigo: product.codigo,
      stock: product.stock,
      categoria: product.categoria,
      tipoVenta: product.tipoVenta,
      laboratorio: product.laboratorio,
      imagen: product.imagen,
      estado: product.estado
    };
  };
  