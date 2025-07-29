import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { createServer } from 'http';            // ✅ Nuevo
import { Server } from 'socket.io';             // ✅ Nuevo

import usersRouter from './routes/users.routes.js';
import sessionsRouter from './routes/sessions.routes.js';
import productsRouter from './routes/products.routes.js';
import cartRoutes from './routes/cart.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import carouselRoutes from './routes/carousel.routes.js'; 
import cors from 'cors';
import path from 'path';

dotenv.config();
const app = express();
const server = createServer(app);               // ✅ Servidor HTTP
const io = new Server(server, {                 // ✅ Socket.IO
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// ✅ Inyectar io en cada request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ✅ Servir archivos estáticos
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Rutas
app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/carousel', carouselRoutes);

// ✅ Conectar a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.log(err));

// ✅ Eventos de conexión de Socket.IO
io.on("connection", (socket) => {
    console.log("🔌 Cliente conectado al WebSocket");

    socket.on("disconnect", () => {
        console.log("❌ Cliente desconectado");
    });
});

// ✅ Escuchar con server, NO app
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default app;