/**
 * users.routes.js
 * Router xử lý các API người dùng theo chuẩn RESTful
 */

import express from "express";
import { adminOnly, protect, authLimiter } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    deleteUser,
    getAllUser,
    getUserById,
    getMyProfile,
    changePassword,
    updateUser
} from "../controller/users.controller.js";

const router = express.Router();

/**
 * GET /api/users/me
 * Lấy thông tin profile người dùng hiện tại
 * Protected - Cần authentication
 */
router.get("/me", protect, asyncHandler(getMyProfile));

/**
 * PUT /api/users/password
 * Đổi mật khẩu người dùng hiện tại
 * Protected - Rate limited (3 requests/phút)
 */
router.put("/password", authLimiter(60 * 1000, 3), protect, asyncHandler(changePassword));

/**
 * GET /api/users
 * Lấy danh sách tất cả người dùng
 * Protected - Admin only
 */
router.get("/", protect, adminOnly, asyncHandler(getAllUser));

/**
 * GET /api/users/:id
 * Lấy thông tin người dùng theo ID
 * Protected - Admin only
 */
router.get("/:id", protect, adminOnly, asyncHandler(getUserById));

/**
 * PUT /api/users/:id
 * Cập nhật thông tin người dùng theo ID
 * Protected - Admin only
 */
router.put("/:id", protect, adminOnly, asyncHandler(updateUser));

/**
 * DELETE /api/users/:id
 * Xóa người dùng theo ID
 * Protected - Admin only
 */
router.delete("/:id", protect, adminOnly, asyncHandler(deleteUser));

export default router;