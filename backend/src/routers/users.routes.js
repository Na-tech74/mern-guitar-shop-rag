import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    deleteUser,
    getAllUser,
    getUserById,
    getMyProfile,
    changePassword,
    update
} from "../controller/users.controller.js";
const router = express.Router();

router.get("/me", protect, asyncHandler(getMyProfile));

router.put("/change-password", protect, asyncHandler(changePassword));

router.get("/", protect, adminOnly, asyncHandler(getAllUser));

router.get("/:id", protect, adminOnly, asyncHandler(getUserById));

router.put("/:id", protect, asyncHandler(update));

router.delete("/:id", protect, adminOnly, asyncHandler(deleteUser));
export default router;