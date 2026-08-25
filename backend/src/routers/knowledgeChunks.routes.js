import express from "express";
import {
    createChunk,
    getAllChunks,
    getChunkById,
    getChunksByDocument,
    updateChunk,
    deleteChunk,
    deleteChunksByDocument
} from "../controller/knowledgeChunks.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", asyncHandler(getAllChunks));
router.get("/:id", asyncHandler(getChunkById));
router.get("/document/:documentId", asyncHandler(getChunksByDocument));
router.post("/", protect, adminOnly, asyncHandler(createChunk));
router.put("/:id", protect, adminOnly, asyncHandler(updateChunk));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteChunk));
router.delete("/document/:documentId", protect, adminOnly, asyncHandler(deleteChunksByDocument));

export default router;
