import express from 'express';
import passport from '../config/passport.config.js';
import { soloUsuario } from '../middlewares/auth.middleware.js';
import { addToCart, removeFromCart, viewCart } from '../controllers/cart.controller.js';
import { purchaseCart } from '../controllers/cart.controller.js';


const router = express.Router();

router.use(passport.authenticate('jwt', { session: false }), soloUsuario);

router.get('/', viewCart);
router.post('/add/:codigo', addToCart);
router.delete('/remove/:codigo', removeFromCart);
router.post('/purchase', purchaseCart);


export default router;
