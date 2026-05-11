import express from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    createOrder,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from "../controller/order.controller.js";

const router = express.Router();

router.post("/create-orders", protect, asyncHandler(createOrder));

router.get("/get-my-orders", protect, asyncHandler(getUserOrders));

router.get("/get-all-orders", protect, adminOnly, asyncHandler(getAllOrders));

router.get("/:id", protect, asyncHandler(getOrderById));

router.put("/:id/status", protect, adminOnly, asyncHandler(updateOrderStatus));

router.delete("/:id", protect, adminOnly, asyncHandler(deleteOrder));

export default router;