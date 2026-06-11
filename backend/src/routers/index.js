import mongoose from 'mongoose';

import authRoutes from './auth.routes.js';
import userRoutes from './users.routes.js';
import categoriseRoutes from './categories.routes.js';
import productRoutes from './product.routes.js';
import blogRoutes from './blog.routes.js';
import orderRoutes from './order.routes.js';
import courseRoutes from './course.routes.js';
import homeContentRoutes from './homeContent.routes.js';
import aboutContentRoutes from './aboutContent.routes.js';
import footerContentRoutes from './footerContent.routes.js';
import contactContentRoutes from './contactContent.routes.js';

export const mountRoutes = (app) => {
    app.get('/', (req, res) => {
        res.json({ message: "Server healthy!" });
    });

    app.get('/api/health', (req, res) => {
        const dbStatus = mongoose.connection.readyState === 1 ? 'up' : 'down';
        res.json({
            status: 'ok',
            db: dbStatus,
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/categories', categoriseRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/blogs', blogRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/courses', courseRoutes);
    app.use('/api/home-content', homeContentRoutes);
    app.use('/api/about-content', aboutContentRoutes);
    app.use('/api/footer-content', footerContentRoutes);
    app.use('/api/contact-content', contactContentRoutes);
};
