import express from 'express';
import passport from '../config/passport.config.js';
import { soloUsuario, soloAdmin } from '../middlewares/auth.middleware.js';
import { getUserTickets, getHistorialTickets } from '../controllers/ticket.controller.js';

const router = express.Router();

// ✅ Ruta para usuarios (ver sus propios tickets)
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  soloUsuario,
  getUserTickets
);

// ✅ Ruta para admin (ver historial de todas las ventas)
router.get(
  '/historial',
  passport.authenticate('jwt', { session: false }),
  soloAdmin,
  getHistorialTickets
);

export default router;