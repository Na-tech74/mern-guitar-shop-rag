import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { uploadImages } from "../services/uploadImages.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { appError } from "../common/appError.js";

const router = express.Router();

// Upload chung (không cần auth)
router.post(
    "/",
    upload.array("images", 5),
    asyncHandler(async (req, res) => {
        if (!req.files || req.files.length === 0) {
            throw appError("No files uploaded!", 400);
        }
        const images = await uploadImages(req.files, "guitar-shop");
        res.json({
            message: "Images uploaded successfully!",
            images
        });
    })
);

export default router;