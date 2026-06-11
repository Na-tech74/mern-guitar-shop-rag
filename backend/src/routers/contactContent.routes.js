import express from "express";
import {
    getContactContent,
    updateContactContent,
    uploadContactImage
} from "../controller/contactContent.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/", asyncHandler(getContactContent));

router.post(
    "/upload",
    protect,
    adminOnly,
    upload.single("image"),
    asyncHandler(uploadContactImage)
);

router.put(
    "/",
    protect,
    adminOnly,
    asyncHandler(updateContactContent)
);

export default router;
