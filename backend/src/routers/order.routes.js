/**
 * order.routes.js
 * Định nghĩa các API routes cho đơn hàng.
 * Base path: /api/orders
 */

import { Router } from "express";
import { protect, adminOnly, staffOrAdmin } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    getDashboardStats,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    requestMomoPayment,
    momoCallback,
    momoReturn,
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
 * Staff & Admin
 */
router.get("/", protect, staffOrAdmin, asyncHandler(getAllOrders));

/**
 * POST /api/orders/momo-payment
 * Tạo link thanh toán MoMo
 * User (cần đăng nhập)
 */
router.post("/momo-payment", protect, asyncHandler(requestMomoPayment));

/**
 * POST /api/orders/momo-callback
 * MoMo IPN callback (không cần auth, MoMo gọi)
 */
router.post("/momo-callback", asyncHandler(momoCallback));

/**
 * GET /api/orders/momo-return
 * MoMo redirect user về sau khi thanh toán
 */
router.get("/momo-return", asyncHandler(momoReturn));

/**
 * GET /api/orders/:id
 * Lấy chi tiết đơn hàng
 * User (của mình) hoặc Admin (bất kỳ)
 */
router.get("/:id", protect, asyncHandler(getOrderById));

/**
 * PUT /api/orders/:id/status
 * Cập nhật trạng thái đơn hàng
 * Staff & Admin
 */
router.put("/:id/status", protect, staffOrAdmin, asyncHandler(updateOrderStatus));

/**
 * DELETE /api/orders/:id
 * Xóa đơn hàng
 * Admin only
 */
router.delete("/:id", protect, adminOnly, asyncHandler(deleteOrder));

export default router;
