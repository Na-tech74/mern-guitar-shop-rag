import categoryModel from "../models/categories.model.js";
import { appError } from "../utils/appError.js";
import {
    formatSuccessResponse,
    sanitizeText
} from "../utils/format.js";

export const createCategory = async (req, res) => {
    const { name, description, image } = req.body;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!name) {
        throw appError("Thiếu trường bắt buộc!", 400);
    }

    const newCategory = await categoryModel.create({
        name: sanitizeText(name),
        slug: createSlug(name),
        description: description ? sanitizeText(description) : "",
        image: image || ""
    });

    return res.status(201).json(formatSuccessResponse(
        'Danh mục đã được tạo thành công!',
        newCategory
    ));
};

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

export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, image } = req.body || {};

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    const category = await categoryModel.findById(id);
    if (!category) {
        throw appError("Danh mục không tồn tại!", 404);
    }

    if (name) {
        category.name = sanitizeText(name);
        category.slug = createSlug(name);
    }

    if (description) {
        category.description = sanitizeText(description);
    }

    if (image !== undefined) {
        category.image = image;
    }

    await category.save();

    return res.json(formatSuccessResponse(
        'Danh mục đã được cập nhật thành công!',
        category
    ));
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    const category = await categoryModel.findById(id);
    if (!category) {
        throw appError("Danh mục không tồn tại!", 404);
    }

    await category.deleteOne();

    return res.json(formatSuccessResponse(
        'Danh mục đã được xóa thành công!'
    ));
};