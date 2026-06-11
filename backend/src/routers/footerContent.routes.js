import express from "express";
import {
    getFooterContent,
    updateFooterContent,
} from "../controller/footerContent.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", asyncHandler(getFooterContent));

router.put(
    "/",
    protect,
    adminOnly,
    asyncHandler(updateFooterContent)
);

export default router;
