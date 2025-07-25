// src/routes/test.routes.js
import express from 'express';
import { testEmail } from '../controllers/test.controller.js';

const router = express.Router();

router.post('/email', testEmail);

export default router;
