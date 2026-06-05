/**
 * server.js
 * Entry point của backend.
 * Nhiệm vụ:
 *   1. Load biến môi trường từ file .env
 *   2. Kết nối MongoDB
 *   3. Khởi động HTTP server
 *   4. Đăng ký graceful shutdown (đóng server + DB khi nhận SIGTERM / SIGINT)
 */

// Load .env TRƯỚC mọi import khác để các module dùng được process.env
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

// Express app (đã được cấu hình middleware + routes trong app.js)
import app from './app.js';
import connectDB from './config/db.config.js';

// Đọc port từ env, mặc định 5000 nếu không có
const port = process.env.PORT || 5000;

/**
 * Khởi động server tuần tự:
 *   - Đợi DB kết nối thành công rồi mới listen port
 *   - Nếu DB fail, log lỗi và exit (không để server chạy mà không có DB)
 */
const startServer = async () => {
    try {
        // 1. Kết nối MongoDB trước (await để chắc chắn thành công)
        await connectDB();

        // 2. Bắt đầu lắng nghe request
        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        /**
         * Graceful shutdown handler
         * Khi nhận signal dừng (Ctrl+C local hoặc SIGTERM từ Docker/PM2):
         *   - Ngừng nhận request mới (server.close)
         *   - Đợi các request đang xử lý hoàn tất
         *   - Đóng kết nối MongoDB
         *   - Thoát process với exit code 0 (thành công)
         */
        const shutdown = (signal) => {
            console.log(`${signal} received, shutting down gracefully...`);
            server.close(() => {
                mongoose.connection.close(false).then(() => {
                    console.log("Connections closed.");
                    process.exit(0);
                });
            });
        };

        // Đăng ký lắng nghe 2 signal phổ biến:
        //   - SIGTERM: Docker, PM2, Kubernetes gửi khi muốn dừng container
        //   - SIGINT:  User nhấn Ctrl+C trong terminal
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (err) {
        // DB fail hoặc lỗi nghiêm trọng khi start -> log + exit code 1 (lỗi)
        console.error("Failed to start server:", err);
        process.exit(1);
    }
};

// Khởi chạy server
startServer();
