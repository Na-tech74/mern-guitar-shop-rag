/**
 * homeContent.routes.js
 * Định nghĩa API routes cho nội dung trang chủ.
 * Base path: /api/home-content
 */

import express from "express";
import {
    getHomeContent,
    updateHomeContent,
    uploadHomeImage,
    uploadHomeVideo
} from "../controller/homeContent.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { upload, uploadVideo } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * GET /api/home-content
 * Lấy nội dung trang chủ
 * Public
 */
router.get("/", asyncHandler(getHomeContent));

/**
 * POST /api/home-content/upload
 * Upload 1 ảnh cho trang chủ (carousel / featuredTypes...)
 * Admin only - multipart/form-data (field: "image")
 */
router.post(
    "/upload",
    protect,
    adminOnly,
    upload.single("image"),
    asyncHandler(uploadHomeImage)
);

/**
 * POST /api/home-content/upload-video
 * Upload 1 video cho trang chủ (clip khuyến mãi / CTA hỗ trợ)
 * Admin only - multipart/form-data (field: "video")
 */
router.post(
    "/upload-video",
    protect,
    adminOnly,
    uploadVideo.single("video"),
    asyncHandler(uploadHomeVideo)
);

/**
 * PUT /api/home-content
 * Cập nhật nội dung trang chủ
 * Admin only - application/json
 */
router.put(
    "/",
    protect,
    adminOnly,
    asyncHandler(updateHomeContent)
);

export default router;
