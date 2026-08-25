import express from "express";
import {
    createDocument,
    getAllDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
} from "../controller/documents.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", asyncHandler(getAllDocuments));
router.get("/:id", asyncHandler(getDocumentById));
router.post("/", protect, adminOnly, asyncHandler(createDocument));
router.put("/:id", protect, adminOnly, asyncHandler(updateDocument));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteDocument));

export default router;
