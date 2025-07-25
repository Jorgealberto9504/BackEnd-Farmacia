// src/controllers/sessions.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserRepository } from "../repositories/user.repository.js";
import { userDTO } from "../dtos/user.dto.js";
import { sendRecoveryEmail } from '../services/mailer.service.js';


dotenv.config();

const userRepo = new UserRepository();

export const registerUser = async (req, res) => {
  const { name, email, password, address, phone } = req.body;
  let { role } = req.body;

  try {
    if (!name || !email || !password || !address || !phone) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    if (!role) {
      role = 'usuario';
    }

    const existingUser = await userRepo.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await userRepo.registerUser({
      name,
      email,
      password: hashedPassword,
      role,
      address,
      phone
    });

    const userSafe = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      address: newUser.address,
      phone: newUser.phone,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: userSafe });

  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userRepo.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 3600000
    });

    const { name, role, address, phone } = user;

    res.status(200).json({
      message: "User logged in successfully",
      user: { name, email, role, address, phone },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in user" });
  }
};

export const getCurrentUser = (req, res) => {
  const safeUser = userDTO(req.user);

  res.status(200).json({
    message: 'Usuario autenticado correctamente',
    user: safeUser
  });
};

export const logoutUser = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: false, // Usa true si estás en HTTPS
    sameSite: "Strict"
  });

  res.status(200).json({ message: "Sesión cerrada correctamente" });
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'El email es requerido' });
    }

    const user = await userRepo.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'No existe ningún usuario con ese correo' });
    }

    // 🔐 Crear token de recuperación con expiración de 1 hora
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetLink = `http://localhost:8080/api/sessions/reset-password/${token}`;

    // 📩 Contenido HTML del correo
    const htmlContent = `
      <h2>Recuperación de contraseña</h2>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}" target="_blank">Restablecer contraseña</a>
      <p>Este enlace expirará en 1 hora.</p>
    `;

    await sendRecoveryEmail(user.email, 'Restablece tu contraseña', htmlContent);

    res.status(200).json({ message: 'Correo de recuperación enviado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al procesar la solicitud', error: error.message });
  }
};


export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Validar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepo.getUserByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar que la nueva contraseña no sea igual a la anterior
    const isSame = bcrypt.compareSync(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({ message: 'La nueva contraseña no puede ser igual a la anterior' });
    }

    // Encriptar y actualizar
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await userRepo.changePassword(user._id, hashedPassword);

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'El enlace ha expirado. Solicita uno nuevo.' });
    }
    res.status(500).json({ message: 'Error al restablecer la contraseña', error: error.message });
  }
};