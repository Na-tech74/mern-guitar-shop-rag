/**
 * product.routes.js
 * Định nghĩa các API endpoints cho sản phẩm
 * Theo chuẩn RESTful
 */

import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProducts,
    deleteProducts,
    searchProductsTop
} from "../controller/products.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

/**
 * Routes cho sản phẩm
 * Base path: /api/products
 */

/**
 * @route   GET /api/products
 * @desc    Lấy danh sách tất cả sản phẩm (có phân trang, lọc, tìm kiếm)
 * @access  Public
 * @query   {number} page - Số trang
 * @query   {number} limit - Số sản phẩm/trang
 * @query   {string} category - Lọc theo danh mục
 * @query   {string} search - Tìm kiếm theo tên
 * @return  {200} Danh sách sản phẩm + phân trang
 */
router.get("/", asyncHandler(getAllProducts));

/**
 * @route   GET /api/products/top
 * @desc    Lấy danh sách sản phẩm nổi bật (bán chạy, giá cao, giá thấp)
 * @access  Public
 * @query   {number} limit - Số sản phẩm (default: 3)
 * @query   {string} sortBy - Tiêu chí: 'sales', 'price', 'priceAsc'
 * @return  {200} Danh sách sản phẩm nổi bật
 */
router.get("/top", asyncHandler(searchProductsTop));

/**
 * @route   GET /api/products/:id
 * @desc    Lấy chi tiết sản phẩm theo ID
 * @access  Public
 * @param   {string} id - ID sản phẩm
 * @return  {200} Chi tiết sản phẩm
 * @return  {400} ID không hợp lệ
 * @return  {404} Không tìm thấy sản phẩm
 */
router.get("/:id", asyncHandler(getProductById));

/**
 * @route   POST /api/products
 * @desc    Tạo sản phẩm mới
 * @access  Private (Admin only)
 * @body    {string} name, description, price, category, stock
 * @body    {File[]} images - Tối đa 5 ảnh
 * @return  {201} Sản phẩm vừa tạo
 * @return  {400} Thiếu thông tin / Sản phẩm đã tồn tại
 * @return  {403} Không có quyền
 */
router.post(
    "/",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(createProduct)
);

/**
 * @route   PUT /api/products/:id
 * @desc    Cập nhật sản phẩm
 * @access  Private (Admin only)
 * @param   {string} id - ID sản phẩm
 * @body    {string} name, description, price, category, stock
 * @body    {File[]} images (tùy chọn) - Ảnh mới
 * @return  {200} Sản phẩm đã cập nhật
 * @return  {400} Thiếu thông tin / ID không hợp lệ
 * @return  {403} Không có quyền
 * @return  {404} Không tìm thấy sản phẩm
 */
router.put(
    "/:id",
    protect,
    adminOnly,
    upload.array("images", 5),
    asyncHandler(updateProducts)
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Xóa sản phẩm
 * @access  Private (Admin only)
 * @param   {string} id - ID sản phẩm
 * @return  {200} Xóa thành công
 * @return  {400} ID không hợp lệ
 * @return  {403} Không có quyền
 * @return  {404} Không tìm thấy sản phẩm
 */
router.delete("/:id", protect, adminOnly, asyncHandler(deleteProducts));

export default router;