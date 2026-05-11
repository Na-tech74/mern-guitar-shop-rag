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

router.post("/create-products", protect, adminOnly, asyncHandler(createProduct));

router.get("/get-all-products", asyncHandler(getAllProducts));

router.get("/latest", asyncHandler(getLatestProducts));

router.get("/top", asyncHandler(getTopProducts));

router.get("/search", asyncHandler(searchProducts));

router.get("/category/:categoryId", asyncHandler(getProductsByCategory));

router.get("/slug/:slug", asyncHandler(getProductBySlug));

router.get("/:id", asyncHandler(getProductById));

router.put("/update-products/:id", protect, adminOnly, asyncHandler(updateProduct));

router.put("/update-products/:id/stock", protect, adminOnly, asyncHandler(updateStock));

router.delete("/:id", protect, adminOnly, asyncHandler(deleteProduct));

router.post(
    "/upload",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(uploadProductImages)
);

router.put("/:id/images", protect, adminOnly, asyncHandler(updateProductImages));

router.post(
    "/:id/images",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(addProductImages)
);

export default router;