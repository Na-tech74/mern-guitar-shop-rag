import express from "express";
import { protect, staffOrAdmin } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getNotifications, markAsRead, markAllAsRead } from "../controller/notification.controller.js";

const router = express.Router();

router.get("/", protect, staffOrAdmin, asyncHandler(getNotifications));
router.put("/read-all", protect, staffOrAdmin, asyncHandler(markAllAsRead));
router.put("/:id/read", protect, staffOrAdmin, asyncHandler(markAsRead));

export default router;
