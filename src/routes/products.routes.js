import express from 'express';
import passport from '../config/passport.config.js';
import { soloAdmin } from '../middlewares/auth.middleware.js';
import { 
  createProduct, 
  getProducts, 
  updateProductByCodigo, 
  deleteProductByCodigo, 
  getAllProductsAdmin,
  subirImagenProducto
} from '../controllers/products.controller.js';
import { upload } from '../config/multer.config.js';

const router = express.Router();

// ✅ Crear producto con imagen
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  soloAdmin,
  upload.single('imagen'),   // ✅ ahora procesa archivos
  createProduct
);

// ✅ Listar productos
router.get('/', getProducts);

// ✅ Admin obtiene productos sin DTO
router.get('/admin', passport.authenticate('jwt', { session: false }), soloAdmin, getAllProductsAdmin);

// ✅ Editar producto con imagen
router.put(
    '/:codigo',
    passport.authenticate('jwt', { session: false }),
    soloAdmin,
    upload.single('imagen'),
    updateProductByCodigo
  );

router.delete('/:codigo', passport.authenticate('jwt', { session: false }), soloAdmin, deleteProductByCodigo);

export default router;