import express from "express";
import upload from "../middleware/upload.middleware.js";
import { uploadImages } from "../services/uploadImages.js";

const router = express.Router();

// upload chung
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const images = await uploadImages(req.files);
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;