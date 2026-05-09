import express from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from "../controller/order.controller.js";

const router = express.Router();

router.get("/", protect, adminOnly, asyncHandler(getAllOrders));
router.get("/:id", protect, adminOnly, asyncHandler(getOrderById));
router.put("/:id/status", protect, adminOnly, asyncHandler(updateOrderStatus));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteOrder));

export default router;