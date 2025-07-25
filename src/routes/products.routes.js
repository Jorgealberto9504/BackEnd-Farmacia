// src/routes/products.routes.js
import express from 'express';
import passport from '../config/passport.config.js';
import { soloAdmin } from '../middlewares/auth.middleware.js';
import { createProduct, getProducts, updateProductByCodigo, deleteProductByCodigo } from '../controllers/products.controller.js';

const router = express.Router();

// 🔒 Ruta protegida solo para administradores
router.post('/', passport.authenticate('jwt', { session: false }), soloAdmin,createProduct);
router.get('/', getProducts);
router.put('/:codigo', passport.authenticate('jwt', { session: false }), soloAdmin, updateProductByCodigo);
router.delete('/:codigo', passport.authenticate('jwt', { session: false }), soloAdmin, deleteProductByCodigo);

export default router;
