import express from "express";
import { adminOnly, protect } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
    deleteUser, getAllUser, getUserById, update
} from "../controller/users.controller.js";

const router = express.Router();
router.get("/get-all-user", protect, adminOnly, asyncHandler(getAllUser));
router.get("/get-user-only/:id", protect, adminOnly, asyncHandler(getUserById));
router.put("/update-user/:id", protect, asyncHandler(update));
router.delete("/delete-user/:id", protect, adminOnly, asyncHandler(deleteUser));

export default router;