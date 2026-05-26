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

router.get("/published", asyncHandler(getPublishedCourses));
router.get("/slug/:slug", asyncHandler(getCourseBySlug));

router.get("/", protect, adminOnly, asyncHandler(getAllCourses));
router.get("/:id", protect, asyncHandler(getCourseById));

router.post("/", protect, adminOnly, upload.single("thumbnail"), asyncHandler(createCourse));
router.put("/:id", protect, adminOnly, upload.single("thumbnail"), asyncHandler(updateCourse));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteCourse));

export default router;
