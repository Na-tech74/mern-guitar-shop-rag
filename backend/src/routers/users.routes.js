import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    deleteUser,
    getAllUser,
    getUserById,
    getMyProfile,
    changePassword,
    update
} from "../controller/users.controller.js";
const router = express.Router();
/**
 * @route GET /api/users/me
 * @desc Lấy thông tin profile người dùng hiện tại
 * @access Private (đã đăng nhập)
 */
router.get("/me", protect, asyncHandler(getMyProfile));
/**
 * @route PUT /api/users/change-password
 * @desc Đổi mật khẩu người dùng hiện tại
 * @access Private (đã đăng nhập)
 */
router.put("/change-password", protect, asyncHandler(changePassword));
/**
 * @route GET /api/users
 * @desc Lấy danh sách tất cả người dùng
 * @access Private (chỉ admin)
 */
router.get("/", protect, adminOnly, asyncHandler(getAllUser));
/**
 * @route GET /api/users/:id
 * @desc Lấy người dùng theo ID
 * @access Private (chỉ admin)
 */
router.get("/:id", protect, adminOnly, asyncHandler(getUserById));
/**
 * @route PUT /api/users/:id
 * @desc Cập nhật thông tin người dùng
 * @access Private (chính người dùng hoặc admin)
 */
router.put("/:id", protect, asyncHandler(update));
/**
 * @route DELETE /api/users/:id
 * @desc Xóa người dùng theo ID
 * @access Private (chỉ admin)
 */
router.delete("/:id", protect, adminOnly, asyncHandler(deleteUser));
export default router;