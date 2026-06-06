/**
 * aboutContent.routes.js
 * Định nghĩa API routes cho nội dung trang Giới thiệu.
 * Base path: /api/about-content
 */

import express from "express";
import {
    getAboutContent,
    updateAboutContent,
    uploadAboutImage
} from "../controller/aboutContent.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * GET /api/about-content
 * Lấy nội dung trang giới thiệu
 * Public
 */
router.get("/", asyncHandler(getAboutContent));

/**
 * POST /api/about-content/upload
 * Upload 1 ảnh cho trang giới thiệu (ảnh câu chuyện,...)
 * Admin only - multipart/form-data (field: "image")
 */
router.post(
    "/upload",
    protect,
    adminOnly,
    upload.single("image"),
    asyncHandler(uploadAboutImage)
);

/**
 * PUT /api/about-content
 * Cập nhật nội dung trang giới thiệu
 * Admin only - application/json
 */
router.put(
    "/",
    protect,
    adminOnly,
    asyncHandler(updateAboutContent)
);

export default router;
