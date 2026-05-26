import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.config.js';

import authRoutes from './routers/auth.routes.js'
import userRoutes from './routers/users.routes.js';
import categoriseRoutes from './routers/categories.routes.js';
import productRoutes from './routers/product.routes.js';
import blogRoutes from './routers/blog.routes.js';
import orderRoutes from './routers/order.routes.js';
import courseRoutes from './routers/course.routes.js';

import { errorHandler } from './middleware/error.middleware.js';

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/courses', courseRoutes);
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send({
        message: " Server healthy !"
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

