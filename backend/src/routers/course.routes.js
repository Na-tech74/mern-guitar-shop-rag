/**
 * course.routes.js
 * Định nghĩa các API routes cho khóa học.
 * Base path: /api/courses
 */

import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { upload } from "../middleware/upload.middleware.js";
import {
    createCourse,
    getAllCourses,
    getPublishedCourses,
    getCourseBySlug,
    getCourseById,
    updateCourse,
    deleteCourse
} from "../controller/course.controller.js";

const router = Router();

/**
 * GET /api/courses/published
 * Lấy danh sách khóa học đã xuất bản (công khai)
 */
router.get("/published", asyncHandler(getPublishedCourses));

/**
 * GET /api/courses/slug/:slug
 * Lấy chi tiết khóa học theo slug (công khai)
 */
router.get("/slug/:slug", asyncHandler(getCourseBySlug));

/**
 * GET /api/courses
 * Lấy tất cả khóa học (bao gồm chưa xuất bản)
 * Admin only
 */
router.get("/", protect, adminOnly, asyncHandler(getAllCourses));

/**
 * GET /api/courses/:id
 * Lấy chi tiết khóa học theo ID
 * User (cần đăng nhập)
 */
router.get("/:id", protect, asyncHandler(getCourseById));

/**
 * POST /api/courses
 * Tạo khóa học mới
 * Admin only - multipart/form-data (field: "thumbnail")
 */
router.post("/", protect, adminOnly, upload.single("thumbnail"), asyncHandler(createCourse));

/**
 * PUT /api/courses/:id
 * Cập nhật khóa học
 * Admin only - multipart/form-data (field: "thumbnail")
 */
router.put("/:id", protect, adminOnly, upload.single("thumbnail"), asyncHandler(updateCourse));

/**
 * DELETE /api/courses/:id
 * Xóa khóa học
 * Admin only
 */
router.delete("/:id", protect, adminOnly, asyncHandler(deleteCourse));

export default router;
