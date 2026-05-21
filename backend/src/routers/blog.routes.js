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

// @route   GET /api/blogs
// @desc    Lấy danh sách tất cả bài viết
// @access  Public
router.get("/", asyncHandler(getAllBlogs));

// @route   GET /api/blogs/:id
// @desc    Lấy chi tiết bài viết theo ID
// @access  Public
router.get("/:id", asyncHandler(getBlogsById));

router.post(
    "/",
    protect,
    adminOnly,
    upload.single("banner"),
    asyncHandler(createBlog)
);

router.put(
    "/:id",
    protect,
    adminOnly,
    upload.single("banner"),
    asyncHandler(updateBlog)
);

router.delete(
    "/:id",
    protect,
    adminOnly,
    asyncHandler(deleteBlog)
);

export default router;
