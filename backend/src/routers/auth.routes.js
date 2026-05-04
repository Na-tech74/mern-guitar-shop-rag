import expess from 'express';
import { adminOnly, protect } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import {
    resetPassword, forgotPassword, logout,
    login, register,
} from '../controller/auth.controller.js';

const router = expess.Router()

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password", asyncHandler(resetPassword));
router.post("/logout/:id", protect, asyncHandler(logout));

export default router;