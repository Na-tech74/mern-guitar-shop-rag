import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getNotifications, markAsRead, markAllAsRead } from "../controller/notification.controller.js";

const router = express.Router();

router.get("/", protect, adminOnly, asyncHandler(getNotifications));
router.put("/read-all", protect, adminOnly, asyncHandler(markAllAsRead));
router.put("/:id/read", protect, adminOnly, asyncHandler(markAsRead));

export default router;
