// src/config/mail.config.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,       // tu correo de envío
    pass: process.env.EMAIL_PASS        // contraseña de aplicación
  }
});
