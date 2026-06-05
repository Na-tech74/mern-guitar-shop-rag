/**
 * app.js
 * Tạo & cấu hình Express application (không khởi động server).
 * Tách riêng để dễ test (Supertest có thể import app mà không cần listen).
 */

import express from 'express';

import { applyGlobalMiddleware } from './config/middleware.config.js';
import { mountRoutes } from './routers/index.js';
import { notFoundHandler } from './middleware/notFound.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();

applyGlobalMiddleware(app);
mountRoutes(app);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
