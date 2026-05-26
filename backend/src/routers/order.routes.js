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

router.post("/", protect, asyncHandler(createOrder));
router.get("/me", protect, asyncHandler(getMyOrders));
router.get("/stats", protect, adminOnly, asyncHandler(getDashboardStats));
router.get("/", protect, adminOnly, asyncHandler(getAllOrders));
router.get("/:id", protect, asyncHandler(getOrderById));
router.put("/:id/status", protect, adminOnly, asyncHandler(updateOrderStatus));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteOrder));

export default router;
