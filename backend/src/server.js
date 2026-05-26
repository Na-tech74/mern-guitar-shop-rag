/**
 * server.js
 * Entry point của backend - Khởi tạo Express server, kết nối database,
 * cấu hình middleware global và mount các API routes.
 */

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

// Kết nối MongoDB
connectDB();

// Middleware global
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Mount các API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/courses', courseRoutes);

// Error handler (phải đặt sau routes)
app.use(errorHandler);

// Health check
app.get('/', (req, res) => {
    res.send({
        message: " Server healthy !"
    });
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

