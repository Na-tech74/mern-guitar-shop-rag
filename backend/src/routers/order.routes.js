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
    getRevenueChart,
    getOrderById,
    updateOrderStatus,
    cancelMyOrder,
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
 * GET /api/orders/revenue-chart
 * Dữ liệu doanh thu cho biểu đồ (7 ngày gần nhất)
 * Staff & Admin
 */
router.get("/revenue-chart", protect, staffOrAdmin, asyncHandler(getRevenueChart));

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
 * PUT /api/orders/:id/cancel
 * Hủy đơn hàng (client)
 * User (cần đăng nhập)
 */
router.put("/:id/cancel", protect, asyncHandler(cancelMyOrder));

/**
 * DELETE /api/orders/:id
 * Xóa đơn hàng
 * Admin only
 */
router.delete("/:id", protect, adminOnly, asyncHandler(deleteOrder));

export default router;
