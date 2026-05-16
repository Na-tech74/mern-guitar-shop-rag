import expess from 'express';
import rateLimit from 'express-rate-limit';
import { protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
    resetPassword, forgotPassword, logout,
    login, register,
    refreshToken,
} from '../controller/auth.controller.js';

const router = expess.Router()

const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { success: false, message: "Quá nhiều yêu cầu, vui lòng thử lại sau 1 phút!" }
});

const refreshLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { success: false, message: "Quá nhiều yêu cầu, vui lòng thử lại sau!" }
});

router.post("/register", authLimiter, asyncHandler(register));
router.post("/login", authLimiter, asyncHandler(login));
router.post("/forgot-password", authLimiter, asyncHandler(forgotPassword));
router.post("/reset-password", authLimiter, asyncHandler(resetPassword));
router.post("/logout", protect, asyncHandler(logout));
router.post("/refresh-token", refreshLimiter, asyncHandler(refreshToken));

export default router;