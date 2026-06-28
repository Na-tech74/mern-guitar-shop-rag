import express from 'express';
import { createReview , getAllReviews} from '../controller/reviews.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { protect, adminOnly } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post('/',asyncHandler(createReview));
router.get('/',protect,asyncHandler(getAllReviews))
export default router;