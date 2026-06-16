import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    createCoupon, getAllCoupons, getCouponById,
    updateCoupon, deleteCoupon, applyCoupon,
    getActiveCoupons
} from "../controller/coupon.controller.js";

const router = express.Router();

router.get("/active", asyncHandler(getActiveCoupons));
router.post("/apply", asyncHandler(applyCoupon));
router.get("/", protect, adminOnly, asyncHandler(getAllCoupons));
router.get("/:id", protect, adminOnly, asyncHandler(getCouponById));
router.post("/create", protect, adminOnly, asyncHandler(createCoupon));
router.put("/:id", protect, adminOnly, asyncHandler(updateCoupon));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteCoupon));

export default router;
