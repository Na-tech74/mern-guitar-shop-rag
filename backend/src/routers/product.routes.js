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
    getLatestProducts,
    getProductsByCategory,
    updateStock,
    uploadProductImages,
    updateProductImages,
    addProductImages
} from "../controller/products.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// ========== ROUTES MỚI (chuẩn) ==========

/**
 * @route POST /api/products
 * @desc Tạo sản phẩm mới
 * @access Private (chỉ admin)
 */
router.post("/", protect, adminOnly, asyncHandler(createProduct));

/**
 * @route GET /api/products
 * @desc Lấy tất cả sản phẩm (có phân trang, tìm kiếm)
 * @access Public
 */
router.get("/", asyncHandler(getAllProducts));

/**
 * @route GET /api/products/latest
 * @desc Lấy sản phẩm mới nhất
 * @access Public
 */
router.get("/latest", asyncHandler(getLatestProducts));

/**
 * @route GET /api/products/top
 * @desc Lấy sản phẩm bán chạy
 * @access Public
 */
router.get("/top", asyncHandler(getTopProducts));

/**
 * @route GET /api/products/search
 * @desc Tìm kiếm sản phẩm nâng cao
 * @access Public
 */
router.get("/search", asyncHandler(searchProducts));

/**
 * @route GET /api/products/category/:categoryId
 * @desc Lấy sản phẩm theo danh mục
 * @access Public
 */
router.get("/category/:categoryId", asyncHandler(getProductsByCategory));

/**
 * @route GET /api/products/slug/:slug
 * @desc Lấy sản phẩm theo slug
 * @access Public
 */
router.get("/slug/:slug", asyncHandler(getProductBySlug));

/**
 * @route GET /api/products/:id
 * @desc Lấy sản phẩm theo ID
 * @access Public
 */
router.get("/:id", asyncHandler(getProductById));

/**
 * @route PUT /api/products/:id
 * @desc Cập nhật sản phẩm
 * @access Private (chỉ admin)
 */
router.put("/:id", protect, adminOnly, asyncHandler(updateProduct));

/**
 * @route PUT /api/products/:id/stock
 * @desc Cập nhật số lượng tồn kho
 * @access Private (chỉ admin)
 */
router.put("/:id/stock", protect, adminOnly, asyncHandler(updateStock));

/**
 * @route DELETE /api/products/:id
 * @desc Xóa sản phẩm
 * @access Private (chỉ admin)
 */
router.delete("/:id", protect, adminOnly, asyncHandler(deleteProduct));

/**
 * @route POST /api/products/upload
 * @desc Upload hình ảnh sản phẩm
 * @access Private (chỉ admin)
 */
router.post(
    "/upload",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(uploadProductImages)
);

/**
 * @route PUT /api/products/:id/images
 * @desc Cập nhật hình ảnh sản phẩm (thay thế)
 * @access Private (chỉ admin)
 */
router.put("/:id/images", protect, adminOnly, asyncHandler(updateProductImages));

/**
 * @route POST /api/products/:id/images
 * @desc Thêm hình ảnh vào sản phẩm
 * @access Private (chỉ admin)
 */
router.post(
    "/:id/images",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(addProductImages)
);

// ========== ROUTES CŨ (giữ lại để test) ==========

// POST - Tạo sản phẩm
router.post("/create-product", protect, adminOnly, asyncHandler(createProduct));

// GET - Lấy tất cả sản phẩm
router.get("/get-all-product", asyncHandler(getAllProducts));

// GET - Lấy sản phẩm theo ID
router.get("/get-product-only/:id", asyncHandler(getProductById));

// GET - Lấy sản phẩm theo slug
router.get("/slug/:slug", asyncHandler(getProductBySlug));

// GET - Tìm kiếm nâng cao
router.get("/search-product", asyncHandler(searchProducts));

// GET - Sản phẩm bán chạy
router.get("/top-products", asyncHandler(getTopProducts));

// PUT - Cập nhật sản phẩm
router.put("/update-product/:id", protect, adminOnly, asyncHandler(updateProduct));

// DELETE - Xóa sản phẩm
router.delete("/delete-product/:id", protect, adminOnly, asyncHandler(deleteProduct));

// POST - Upload ảnh
router.post(
    "/images/upload",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(uploadProductImages)
);

// PUT - Cập nhật ảnh sản phẩm
router.put("/update-product-images/:id", protect, adminOnly, asyncHandler(updateProductImages));

// POST - Thêm ảnh vào sản phẩm
router.post(
    "/add-product-images/:id",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(addProductImages)
);

export default router;