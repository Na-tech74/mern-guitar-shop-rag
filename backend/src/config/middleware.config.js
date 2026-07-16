/**
 * middleware.config.js
 * Tập trung khai báo & áp dụng các global middleware cho Express app.
 * Thứ tự: helmet -> cors -> compression -> morgan -> body parser
 *         -> cookie parser -> sanitize -> global rate-limit
 */

import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';

import { mongoSanitize } from '../middleware/sanitize.middleware.js';

/**
 * Áp dụng toàn bộ global middleware vào Express app
 * @param {import('express').Express} app
 */
export const applyGlobalMiddleware = (app) => {
    // bảo mật HTTP headers
    app.use(helmet());

    const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
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
    //nén nội dung response (thường dùng gzip) trước khi gửi về client, giúp giảm dung lượng dữ liệu truyền qua mạng, tăng tốc tải trang. Client tự động giải nén khi nhận được.
    app.use(compression());
    //Log request (format combined ở production, dev ở dev)
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
    //Parse JSON body, giới hạn 1MB
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));

    app.use(cookieParser());

    app.use(mongoSanitize);
};
