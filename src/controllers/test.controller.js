// src/controllers/test.controller.js
import { sendRecoveryEmail } from '../services/mailer.service.js';

export const testEmail = async (req, res) => {
  try {
    const result = await sendRecoveryEmail(
      'jorgealberto9504@gmail.com',
      'Prueba de recuperación',
      `<h1>Este es un correo de prueba</h1><p>Funciona correctamente</p>`
    );

    res.status(200).json({ message: 'Correo enviado correctamente', result });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar correo', error });
  }
};
