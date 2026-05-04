import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    createCategory, getAllCategory, getCategoryById,
    updateCategory, deleteCategory
} from "../controller/category.controller.js";
const router = express.Router();

router.post("/create-category", protect, adminOnly, asyncHandler(createCategory));
router.get("/get-all-category", asyncHandler(getAllCategory));
router.get("/get-category-only/:id", asyncHandler(getCategoryById));
router.put("/update-category/:id", protect, adminOnly, asyncHandler(updateCategory));
router.delete("/delete-category/:id", protect, adminOnly, asyncHandler(deleteCategory));

export default router;