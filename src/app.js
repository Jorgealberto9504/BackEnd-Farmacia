import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import usersRouter from './routes/users.routes.js';
import sessionsRouter from './routes/sessions.routes.js';
import productsRouter from './routes/products.routes.js';
import testRoutes from './routes/test.routes.js';
import cartRoutes from './routes/cart.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import cors from 'cors';




dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));    
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: 'http://localhost:5173', // Tu frontend
    credentials: true
  }));

app.use('/api/users', usersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/test', testRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/tickets', ticketRoutes);



mongoose.connect(MONGO_URI)
    .then(()=>console.log("MongoDB connected"))
    .catch((err)=>console.log(err));

    
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);

export default app;