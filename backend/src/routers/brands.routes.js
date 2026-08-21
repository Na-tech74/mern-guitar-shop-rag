import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { upload } from "../middleware/upload.middleware.js";
import {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
} from "../controller/brands.controller.js";

const router = express.Router();

router.get("/", asyncHandler(getAllBrands));
router.get("/:id", asyncHandler(getBrandById));
router.post("/create", protect, adminOnly, upload.single("logo"), asyncHandler(createBrand));
router.put("/:id", protect, adminOnly, upload.single("logo"), asyncHandler(updateBrand));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteBrand));

export default router;
