/**
 * categories.routes.js
 * Định nghĩa các API routes cho danh mục sản phẩm
 * Base path: /api/v1/categories
 */

import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { upload } from "../middleware/upload.middleware.js";
import {
    createCategory, getAllCategory, getCategoryById,
    updateCategory, deleteCategory
} from "../controller/categories.controller.js";

const router = express.Router();

/**
 * GET /api/v1/categories - Lấy danh sách danh mục
 * @public
 */
router.get("/", asyncHandler(getAllCategory));

/**
 * GET /api/v1/categories/:id - Lấy chi tiết danh mục
 * @public
 */
router.get("/:id", asyncHandler(getCategoryById));

/**
 * POST /api/categories/create - Tạo danh mục mới
 * @requires Authorization (Admin)
 * @body {name, description, image} - image là file upload
 */
router.post("/create", protect, adminOnly, upload.single("image"), asyncHandler(createCategory));

/**
 * PUT /api/v1/categories/:id - Cập nhật danh mục
 * @requires Authorization (Admin)
 */
router.put("/:id", protect, adminOnly, upload.single("image"), asyncHandler(updateCategory));

/**
 * DELETE /api/v1/categories/:id - Xóa danh mục
 * @requires Authorization (Admin)
 */
router.delete("/:id", protect, adminOnly, asyncHandler(deleteCategory));

export default router;