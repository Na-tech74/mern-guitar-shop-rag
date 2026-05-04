import categoryModel from "../models/category.model.js";
import { appError } from "../common/appError.js";
import { createSlug } from "../utils/slug.js";

export const createCategory = async (req, res) => {
    // kiểm tra nhập thông tin vào form raw JSON
    const { name, description } = req.body;
    // kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    };
    // kiểm tra nhập đầy đủ thông tin
    if (!name || !description) {
        throw appError("Missing fields!", 400); // 400: thiếu dữ liệu
    };

    const createCategory = await categoryModel.create({
        name,
        slug: createSlug(name),
        description
    });
    return res.json(createCategory);
};
/* lấy tất cả danh mục */
export const getAllCategory = async (req, res) => {
    const category = await categoryModel.find();
    if (!category) {
        throw appError("Category not found!", 404);
    };
    return res.json(category);
};
/* lấy danh mục theo id */
export const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if (!category) {
        throw appError("Category not found!", 404);
    };
    return res.json(category);
};

/* cập nhật danh mục */
export const updateCategory = async (req, res) => {

    const { id } = req.params;
    const { name, description } = req.body;

    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    };

    const category = await categoryModel.findById(id);
    if (!category) {
        throw appError("Category not found!", 404);
    };
    // cập nhật lại các trường thông tin
    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();
    return res.json(category);
};

/* xóa danh mục */
export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    
    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    };

    const category = await categoryModel.findById(id);
    if (!category) {
        throw appError("Category not found!", 404);
    };
    await category.deleteOne();
    return res.json({
        message: "Category deleted successfully!"
    });
}