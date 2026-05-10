import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    createCategory, getAllCategory, getCategoryById,
    updateCategory, deleteCategory
} from "../controller/categories.controller.js";
const router = express.Router();

router.post("/create-categories", protect, adminOnly, asyncHandler(createCategory));
router.get("/get-all-categories", asyncHandler(getAllCategory));
router.get("/get-categories-only/:id", asyncHandler(getCategoryById));
router.put("/update-categories/:id", protect, adminOnly, asyncHandler(updateCategory));
router.delete("/delete-categories/:id", protect, adminOnly, asyncHandler(deleteCategory));

export default router;