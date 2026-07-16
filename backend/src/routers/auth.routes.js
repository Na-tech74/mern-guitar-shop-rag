/**
 * auth.routes.js
 * Router xử lý các API xác thực người dùng theo chuẩn RESTful
 */

import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
    resetPassword,
    forgotPassword,
    logout,
    login,
    register,
    refreshAccessToken
} from '../controller/auth.controller.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 * Public - Rate limited
 */
router.post("/register", asyncHandler(register));

/**
 * POST /api/auth/login
 * Đăng nhập tài khoản
 * Public - Rate limited
 */
router.post("/login", asyncHandler(login));

/**
 * POST /api/auth/logout
 * Đăng xuất tài khoản
 * Protected - Cần authentication
 */
router.post("/logout", protect, asyncHandler(logout));

/**
 * POST /api/auth/refresh
 * Làm mới access token
 * Public - Rate limited
 */
router.post("/refresh", asyncHandler(refreshAccessToken));

/**
 * POST /api/auth/password/forgot
 * Gửi link đặt lại mật khẩu qua email
 * Public - Rate limited
 */
router.post("/password/forgot", asyncHandler(forgotPassword));

/**
 * POST /api/auth/password/reset
 * Đặt lại mật khẩu mới
 * Public - Rate limited
 */
router.post("/password/reset", asyncHandler(resetPassword));

export default router;