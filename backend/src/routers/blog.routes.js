import express from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
    uploadBlogBanner,
    uploadBlogBannerDirect
} from "../controller/blog.controller.js";

const router = express.Router();

router.get("/get-all-blogs", getAllBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.get("/:id", getBlogById);

router.post("/create-blogs", protect, adminOnly, createBlog);
router.put("/update-blogs/:id", protect, adminOnly, updateBlog);
router.delete("/delete-blogs/:id", protect, adminOnly, deleteBlog);
router.post("/:id/banner", protect, adminOnly, upload.single("banner"), uploadBlogBanner);
router.post("/upload-banner", protect, adminOnly, upload.single("banner"), uploadBlogBannerDirect);

export default router;