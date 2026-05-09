import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.config.js';

import authRoutes from './routers/auth.routes.js'
import userRoutes from './routers/users.routes.js';
import categoryRoutes from './routers/category.routes.js';
import productRoutes from './routers/product.routes.js';
import uploadRoutes from './routers/upload.routes.js';

import { errorHandler } from './middleware/error.middleware.js';

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);
app.use('/api/categorise', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/uploads', uploadRoutes);
app.use(errorHandler);
app.get('/', (req, res) => {
    res.send({
        message: " Server healthy !"
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

