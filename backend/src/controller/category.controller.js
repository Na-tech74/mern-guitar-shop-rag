import categoryModel from "../models/category.model.js";
import { appError } from "../common/appError.js";
import { createSlug } from "../utils/slug.js";
import {
    formatSuccessResponse,
    sanitizeText
} from "../utils/format.js";

/**
 * @desc Tạo danh mục mới
 * @route POST /api/categories
 * @access Private (chỉ admin)
 */
export const createCategory = async (req, res) => {
    const { name, description } = req.body;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Kiểm tra các trường bắt buộc
    if (!name || !description) {
        throw appError("Thiếu trường bắt buộc!", 400);
    }

    // Tạo danh mục mới (sanitize text để tránh XSS)
    const createCategory = await categoryModel.create({
        name: sanitizeText(name),
        slug: createSlug(name),
        description: sanitizeText(description)
    });

    return res.status(201).json(formatSuccessResponse(
        'Danh mục đã được tạo thành công!',
        createCategory
    ));
};

/**
 * @desc Lấy tất cả danh mục
 * @route GET /api/categories
 * @access Public
 */
export const getAllCategory = async (req, res) => {
    const category = await categoryModel.find();

    if (!category || category.length === 0) {
        throw appError("Danh mục không tồn tại!", 404);
    }

    return res.json(formatSuccessResponse(
        'Danh mục đã được lấy thành công!',
        category
    ));
};

/**
 * @desc Lấy danh mục theo ID
 * @route GET /api/categories/:id
 * @access Public
 */
export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    if (!category) {
        throw appError("Danh mục không tồn tại!", 404);
    }

    return res.json(formatSuccessResponse(
        'Danh mục đã được lấy thành công!',
        category
    ));
};

/**
 * @desc Cập nhật danh mục
 * @route PUT /api/categories/:id
 * @access Private (chỉ admin)
 */
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Tìm danh mục
    const category = await categoryModel.findById(id);
    if (!category) {
        throw appError("Danh mục không tồn tại!", 404);
    }

    // Cập nhật tên (tạo slug mới)
    if (name) {
        category.name = sanitizeText(name);
        category.slug = createSlug(name);
    }

    // Cập nhật mô tả (sanitize)
    if (description) {
        category.description = sanitizeText(description);
    }

    await category.save();

    return res.json(formatSuccessResponse(
        'Danh mục đã được cập nhật thành công!',
        category
    ));
};

/**
 * @desc Xóa danh mục
 * @route DELETE /api/categories/:id
 * @access Private (chỉ admin)
 */
export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Tìm danh mục
    const category = await categoryModel.findById(id);
    if (!category) {
        throw appError("Danh mục không tồn tại!", 404);
    }

    await category.deleteOne();

    return res.json(formatSuccessResponse(
        'Danh mục đã được xóa thành công!'
    ));
};