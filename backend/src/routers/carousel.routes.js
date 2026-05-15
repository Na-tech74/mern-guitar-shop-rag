import express from "express";
import { getAllCarousels, getActiveCarousels, getCarouselById, createCarousel, updateCarousel, deleteCarousel } from "../controller/carousel.controller.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = express.Router();

router.get("/get-all-carousels", getAllCarousels);
router.get("/get-active-carousels", getActiveCarousels);
router.get("/:id", getCarouselById);
router.post("/", protect, adminOnly, upload.array("images", 1), asyncHandler(createCarousel));
router.put("/:id", protect, adminOnly , upload.array("images", 1),asyncHandler( updateCarousel));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteCarousel));

export default router;