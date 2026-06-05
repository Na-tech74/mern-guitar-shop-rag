/**
 * categories.controller.js
 * Xử lý các API liên quan đến danh mục sản phẩm: tạo, lấy danh sách, lấy chi tiết, cập nhật, xóa
 */

import Category from "../models/categories.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { formatDateTime, sanitizeText } from "../utils/format.js";
import { uploadImages } from "../services/uploadImages.js";
import { isValidObjectId } from "../utils/valid.js";
/**
 * Tạo danh mục mới (Admin only)
 * @param {string} name - Tên danh mục (bắt buộc)
 * @param {string} description - Mô tả danh mục (bắt buộc)
 * @param {File} image - Hình ảnh danh mục (bắt buộc, upload)
 * @requires req.user.role = 'admin'
 * @throws {400} Thiếu trường bắt buộc
 * @throws {403} Không có quyền
 * @returns {201} Danh mục vừa tạo
 */
export const createCategory = async (req, res) => {
    const { name, description } = req.body;

    // vì hình ảnh là file nên phải req.file
    const imageFile = req.file;

    if (!name || !description) {
        throw appError("Thiếu trường bắt buộc!", 400);
    }

    if (!imageFile) {
        throw appError("Vui lòng tải lên hình ảnh danh mục!", 400);
    }

    // Kiểm tra danh mục đã tồn tại bằng tên của danh mục đó
    const existingCategory = await Category.findOne({ name: sanitizeText(name) });
    if (existingCategory) {
        throw appError("Tên danh mục đã tồn tại!", 400);
    }
    // Upload ảnh lên Cloudinary (thư mục: guitar-shop/categories)
    const [imageUrl] = await uploadImages([imageFile], "guitar-shop/categories");

    // Tạo danh mục mới với thông tin và URL ảnh
    const newCategory = await Category.create({
        name: sanitizeText(name),
        description: sanitizeText(description),
        image: imageUrl,
    });

    return appSuccess(res, {
        statusCode: 201,
        message: "Tạo danh mục thành công",
        data: {
            category: {
                id: newCategory._id,
                name: newCategory.name,
                description: newCategory.description,
                image: newCategory.image,
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
    const categories = await Category.find({ isActive: true });

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh mục thành công!",
        data: { categories }
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
    const category = await Category.findById(id);

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
 * Cập nhật danh mục (Admin only)
 * @param {string} id - ID danh mục (params)
 * @param {string} name - Tên mới (tùy chọn)
 * @param {string} description - Mô tả mới (tùy chọn)
 * @param {string} image - Hình ảnh mới (tùy chọn)
 * @requires req.user.role = 'admin'
 * @throws {403} Không có quyền
 * @throws {404} Danh mục không tồn tại
 * @returns {200} Danh mục đã cập nhật
 */
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description, image } = req.body;

    if (!isValidObjectId(id)) {
        throw appError("ID không hợp lệ!", 400);
    }

    const category = await Category.findById(id);

    if (!category) {
        throw appError("Danh mục không tồn tại!", 404);
    }
    // Cập nhật các trường mới
    if (name) { category.name = sanitizeText(name); }
    if (description) { category.description = sanitizeText(description); }
    if (req.file) {
        const [imageUrl] = await uploadImages([req.file], "guitar-shop/categories");
        category.image = imageUrl;
    } else if (image !== undefined) {
        category.image = image;
    }

    await category.save();

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

    await category.deleteOne();

    return appSuccess(res, {
        statusCode: 200,
        message: "Danh mục đã được xóa!",
    });
};