// src/routes/sessions.routes.js
import { Router } from 'express';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from '../controllers/sessions.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

// ESTE es el que importa:
router.get('/current', verifyToken, getCurrentUser);

router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;