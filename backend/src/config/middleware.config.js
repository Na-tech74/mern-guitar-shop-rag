/**
 * middleware.config.js
 * Tập trung khai báo & áp dụng các global middleware cho Express app.
 * Thứ tự: helmet -> cors -> compression -> morgan -> body parser
 *         -> cookie parser -> sanitize -> global rate-limit
 */

import jwt from 'jsonwebtoken';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { mongoSanitize } from '../middleware/sanitize.middleware.js';
import { appError } from '../utils/appResponse.js';

const isAdminRequest = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        return decoded?.role === 'admin';
    } catch (e) {
        return false;
    }
};

const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => isAdminRequest(req),
    handler: (req, res, next) => {
        return next(appError("Quá nhiều yêu cầu, vui lòng thử lại sau!", 429));
    }
});

/**
 * Áp dụng toàn bộ global middleware vào Express app
 * @param {import('express').Express} app
 */
export const applyGlobalMiddleware = (app) => {
    app.use(helmet());

    const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error(`CORS: origin ${origin} not allowed`));
        },
        credentials: true
    }));

    app.use(compression());

    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));

    app.use(cookieParser());

    app.use(mongoSanitize);

    app.use(globalRateLimiter);
};
