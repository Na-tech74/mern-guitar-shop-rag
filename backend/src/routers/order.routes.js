/**
 * order.routes.js
 * Định nghĩa các API routes cho đơn hàng.
 * Base path: /api/orders
 */

import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    getDashboardStats,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from "../controller/order.controller.js";

const router = Router();

/**
 * POST /api/orders
 * Tạo đơn hàng mới từ giỏ hàng
 * User (cần đăng nhập)
 */
router.post("/", protect, asyncHandler(createOrder));

/**
 * GET /api/orders/me
 * Lấy lịch sử đơn hàng của người dùng hiện tại
 * User (cần đăng nhập)
 */
router.get("/me", protect, asyncHandler(getMyOrders));

/**
 * GET /api/orders/stats
 * Thống kê dashboard (tổng quan đơn hàng, doanh thu)
 * Admin only
 */
router.get("/stats", protect, adminOnly, asyncHandler(getDashboardStats));

/**
 * GET /api/orders
 * Lấy tất cả đơn hàng (phân trang, lọc trạng thái)
 * Admin only
 */
router.get("/", protect, adminOnly, asyncHandler(getAllOrders));

/**
 * GET /api/orders/:id
 * Lấy chi tiết đơn hàng
 * User (của mình) hoặc Admin (bất kỳ)
 */
router.get("/:id", protect, asyncHandler(getOrderById));

/**
 * PUT /api/orders/:id/status
 * Cập nhật trạng thái đơn hàng
 * Admin only
 */
router.put("/:id/status", protect, adminOnly, asyncHandler(updateOrderStatus));

/**
 * DELETE /api/orders/:id
 * Xóa đơn hàng
 * Admin only
 */
router.delete("/:id", protect, adminOnly, asyncHandler(deleteOrder));

export default router;
