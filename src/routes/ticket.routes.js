import express from 'express';
import passport from '../config/passport.config.js';
import { soloUsuario, soloAdmin } from '../middlewares/auth.middleware.js';
import { 
  getUserTickets, 
  getHistorialTickets, 
  getPedidosPendientes, 
  marcarPedidoSurtido 
} from '../controllers/ticket.controller.js';

const router = express.Router();

// 🔹 Ruta para usuarios (ver sus propios tickets)
router.get('/', passport.authenticate('jwt', { session: false }), soloUsuario, getUserTickets);

// 🔹 Ruta para admin (historial de todos los tickets)
router.get('/historial', passport.authenticate('jwt', { session: false }), soloAdmin, getHistorialTickets);

// 🔹 Ruta para admin (ver solo los pendientes)
router.get('/pendientes', passport.authenticate('jwt', { session: false }), soloAdmin, getPedidosPendientes);

// 🔹 Ruta para admin (marcar un pedido como surtido por código)
router.put('/surtir/:codigo', passport.authenticate('jwt', { session: false }), soloAdmin, marcarPedidoSurtido);

export default router;