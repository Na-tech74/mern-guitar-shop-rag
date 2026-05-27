/**
 * blog.routes.js
 * Định nghĩa các API routes cho bài viết blog.
 * Base path: /api/blogs
 */

import express from "express";
import {
    createBlog,
    getAllBlogs,
    getBlogsById,
    updateBlog,
    deleteBlog
} from "../controller/blog.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * GET /api/blogs
 * Lấy danh sách tất cả bài viết
 * Public
 */
router.get("/", asyncHandler(getAllBlogs));

/**
 * GET /api/blogs/:id
 * Lấy chi tiết bài viết theo ID
 * Public
 */
router.get("/:id", asyncHandler(getBlogsById));

/**
 * POST /api/blogs
 * Tạo bài viết mới
 * Admin only - multipart/form-data (field: "images")
 */
router.post(
    "/",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(createBlog)
);

/**
 * PUT /api/blogs/:id
 * Cập nhật bài viết
 * Admin only - multipart/form-data (field: "images")
 */
router.put(
    "/:id",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(updateBlog)
);

/**
 * DELETE /api/blogs/:id
 * Xóa bài viết
 * Admin only
 */
router.delete(
    "/:id",
    protect,
    adminOnly,
    asyncHandler(deleteBlog)
);

export default router;
