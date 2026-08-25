/**
 * categories.controller.js
 * Xử lý các API liên quan đến danh mục sản phẩm: tạo, lấy danh sách, lấy chi tiết, cập nhật, xóa
 */

import Category from "../models/categories.model.js";
import Product from "../models/product.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { formatDateTime, sanitizeText } from "../utils/format.js";
import { uploadImages } from "../services/uploadImages.js";
import { isValidObjectId } from "../utils/valid.js";
/**
 * Tạo danh mục mới (Admin only)
 * @param {string} name - Tên danh mục (bắt buộc)
 * @param {File} image - Hình ảnh danh mục (bắt buộc, upload)
 * @requires req.user.role = 'admin'
 * @throws {400} Thiếu trường bắt buộc
 * @throws {403} Không có quyền
 * @returns {201} Danh mục vừa tạo
 */
export const createCategory = async (req, res) => {
    
    const { name, parent } = req.body;

    const imageFile = req.file;

    if (!name) {
        throw appError("Thiếu trường bắt buộc!", 400);
    }

    if (!imageFile && !parent) {
        throw appError("Vui lòng tải lên hình ảnh danh mục!", 400);
    }

    const existingCategory = await Category.findOne({ name: sanitizeText(name) });
    if (existingCategory) {
        throw appError("Tên danh mục đã tồn tại!", 400);
    }

    if (parent && !isValidObjectId(parent)) {
        throw appError("ID danh mục cha không hợp lệ!", 400);
    }

    let imageUrl = "";
    if (imageFile) {
        [imageUrl] = await uploadImages([imageFile], "guitar-shop/categories");
    }

    const newCategory = await Category.create({
        name: sanitizeText(name),
        image: imageUrl,
        parent: parent || null,
    });

    if (newCategory.parent) {
        await newCategory.populate("parent", "name");
    }

    return appSuccess(res, {
        statusCode: 201,
        message: "Tạo danh mục thành công",
        data: {
            category: {
                id: newCategory._id,
                name: newCategory.name,
                image: newCategory.image,
                parent: newCategory.parent,
                createdAt: formatDateTime(newCategory.createdAt),
                updatedAt: formatDateTime(newCategory.updatedAt),
            }
        }
    });
};

/**
 * Lấy danh sách tất cả danh mục
 * @returns {200} Danh sách danh mục
 * @throws {404} Không có danh mục nào
 */
export const getAllCategory = async (req, res) => {
    const { parent } = req.query;

    const filter = { isActive: true };
    if (parent === "null") {
        filter.parent = null;
    } else if (parent) {
        if (!isValidObjectId(parent)) {
            throw appError("ID danh mục cha không hợp lệ!", 400);
        }
        filter.parent = parent;
    }

    const categories = await Category.find(filter).populate("parent", "name");

    const parents = await Category.find({ isActive: true, parent: null });

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh mục thành công!",
        data: { categories, parents }
    });
};

/**
 * Lấy chi tiết danh mục theo ID
 * @param {string} id - ID danh mục (params)
 * @throws {404} Danh mục không tồn tại
 * @returns {200} Chi tiết danh mục
 */
export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID không hợp lệ!", 400);
    }
    const category = await Category.findById(id).populate("parent", "name");

    if (!category) {
        throw appError("Danh mục không tồn tại!", 404);
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh mục thành công!",
        data: { category }
    });
};

/**
 * Lấy danh mục bán chạy nhất (cho admin dashboard)
 * Aggregate sản phẩm theo danh mục, tính tổng số lượng đã bán
 * @query {number} limit - Số danh mục trả về (default: 5)
 * @returns {200} Danh sách danh mục bán chạy kèm tổng sản phẩm và tổng đã bán
 */
export const getTopSellingCategories = async (req, res) => {
    const { limit = 5 } = req.query;

    const topCategories = await Product.aggregate([
        { $group: { _id: "$category", totalSold: { $sum: "$sold" }, productCount: { $sum: 1 } } },
        { $sort: { totalSold: -1 } },
        { $limit: parseInt(limit) },
        { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" } },
        { $unwind: "$category" },
        { $project: { _id: 1, totalSold: 1, productCount: 1, name: "$category.name", image: "$category.image" } }
    ]);

    const totalSold = topCategories.reduce((sum, c) => sum + c.totalSold, 0);

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh mục bán chạy thành công!",
        data: { categories: topCategories, totalSold }
    });
};

/**
 * Cập nhật danh mục (Admin only)
 * @param {string} id - ID danh mục (params)
 * @param {string} name - Tên mới (tùy chọn)
 * @param {string} image - Hình ảnh mới (tùy chọn)
 * @requires req.user.role = 'admin'
 * @throws {403} Không có quyền
 * @throws {404} Danh mục không tồn tại
 * @returns {200} Danh mục đã cập nhật
 */
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, image, parent } = req.body;

    if (!isValidObjectId(id)) {
        throw appError("ID không hợp lệ!", 400);
    }

    const category = await Category.findById(id);

    if (!category) {
        throw appError("Danh mục không tồn tại!", 404);
    }

    if (name) { category.name = sanitizeText(name); }
    if (parent !== undefined) {
        if (parent === "" || parent === "null") {
            category.parent = null;
        } else {
            if (!isValidObjectId(parent)) {
                throw appError("ID danh mục cha không hợp lệ!", 400);
            }
            category.parent = parent;
        }
    }
    if (req.file) {
        const [imageUrl] = await uploadImages([req.file], "guitar-shop/categories");
        category.image = imageUrl;
    } else if (image !== undefined) {
        category.image = image;
    }

    await category.save();

    if (category.parent) {
        await category.populate("parent", "name");
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật danh mục thành công!",
        data: { category }
    });
};

/**
 * Xóa danh mục (Admin only)
 * @param {string} id - ID danh mục (params)
 * @requires req.user.role = 'admin'
 * @throws {403} Không có quyền
 * @throws {404} Danh mục không tồn tại
 * @returns {200} Thông báo xóa thành công
 */
export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID không hợp lệ!", 400);
    }

    const category = await Category.findById(id);
    if (!category) {
        throw appError("Danh mục không tồn tại!", 404);
    }

    await Category.updateMany({ parent: id }, { parent: null });
    await category.deleteOne();

    return appSuccess(res, {
        statusCode: 200,
        message: "Danh mục đã được xóa!",
    });
};