import express from 'express';
import passport from '../config/passport.config.js';
import { soloUsuario } from '../middlewares/auth.middleware.js';
import { getUserTickets } from '../controllers/ticket.controller.js';

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), soloUsuario, getUserTickets);

export default router;
