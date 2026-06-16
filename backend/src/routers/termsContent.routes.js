import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getTermsContent, updateTermsContent } from "../controller/termsContent.controller.js";

const router = express.Router();

router.get("/", asyncHandler(getTermsContent));
router.put("/", protect, adminOnly, asyncHandler(updateTermsContent));

export default router;
