// ✅ src/routes/products.routes.js
import express from 'express';
import passport from '../config/passport.config.js';
import { soloAdmin } from '../middlewares/auth.middleware.js';
import { 
  createProduct, 
  getProducts, 
  updateProductByCodigo, 
  deleteProductByCodigo, 
  getAllProductsAdmin 
} from '../controllers/products.controller.js';

const router = express.Router();

// ✅ Crear producto (solo admin)
router.post('/', passport.authenticate('jwt', { session: false }), soloAdmin, createProduct);

// ✅ Listar productos (vista pública con DTO)
router.get('/', getProducts);

// ✅ Listar productos (vista admin, sin DTO)
router.get('/admin', passport.authenticate('jwt', { session: false }), soloAdmin, getAllProductsAdmin);

// ✅ Editar producto por código
router.put('/:codigo', passport.authenticate('jwt', { session: false }), soloAdmin, updateProductByCodigo);

// ✅ Eliminar producto por código
router.delete('/:codigo', passport.authenticate('jwt', { session: false }), soloAdmin, deleteProductByCodigo);

export default router;