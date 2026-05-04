import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    searchProducts,
    getTopProducts,
    uploadProductImages,
    updateProductImages,
    addProductImages
} from "../controller/products.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Admin routes - đặt trước để tránh xung đột với routes động
router.post(
    "/images/upload",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(uploadProductImages)
);  // Upload ảnh sản phẩm

// Route công khai (không cần auth)
router.get("/search", asyncHandler(searchProducts));              // Tìm kiếm nâng cao
router.get("/top", asyncHandler(getTopProducts));                 // Lấy sản phẩm bán chạy
router.get("/slug/:slug", asyncHandler(getProductBySlug));        // Lấy sản phẩm theo slug

// Routes cần Admin - CRUD
router.post("/", protect, adminOnly, asyncHandler(createProduct));          // Tạo sản phẩm
router.get("/", asyncHandler(getAllProducts));                    // Lấy tất cả sản phẩm

// Routes động (phải cuối cùng)
router.get("/:id", asyncHandler(getProductById));                 // Lấy sản phẩm theo ID
router.put("/:id", protect, adminOnly, asyncHandler(updateProduct));        // Cập nhật sản phẩm
router.delete("/:id", protect, adminOnly, asyncHandler(deleteProduct));     // Xóa sản phẩm

// Routes cập nhật ảnh
router.put(
    "/:id/images",
    protect,
    adminOnly,
    asyncHandler(updateProductImages)
);  // Cập nhật ảnh sản phẩm (gửi URL)

router.post(
    "/:id/images/add",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(addProductImages)
);  // Thêm ảnh vào sản phẩm

export default router;
