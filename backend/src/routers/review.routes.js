import express from 'express';
import { createReview, getAllReviews, updateReviews, deleteReview } from '../controller/reviews.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect, adminOnly } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post('/', protect, asyncHandler(createReview));
router.get('/', asyncHandler(getAllReviews));
router.put('/:id', protect, asyncHandler(updateReviews));
router.delete('/:id', protect, asyncHandler(deleteReview));
export default router;