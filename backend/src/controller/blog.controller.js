/**
 * blog.controller.js
 * Xử lý các API liên quan đến bài viết blog: tạo, lấy danh sách,
 * chi tiết, cập nhật, xóa.
 */

import Blog from "../models/blogs.model.js"
import { appError, appSuccess } from "../utils/appResponse.js";
import { sanitizeText } from "../utils/format.js";
import { uploadImages } from "../services/uploadImages.js";
import { isValidObjectId } from "../utils/valid.js";

/**
 * Tạo bài viết mới (admin). Hỗ trợ upload banner image.
 * @param {Object} req - Request object chứa title, excerpt, content trong body và file ảnh trong req.files
 * @param {Object} res - Response object
 * @throws {400} Thiếu thông tin | Bài viết đã tồn tại | Không có ảnh
 * @returns {201} Bài viết đã tạo
 */
export const createBlog = async (req, res) => {
    const { title, excerpt, content } = req.body;
    const imageFiles = req.files;

    if (!title || !content) {
        throw appError("Nhập đầy đủ thông tin bài viết!", 400)
    }

    if (!imageFiles || imageFiles.length === 0) {
        throw appError("Vui lòng tải lên hình ảnh sản phẩm!", 400);
    }

    const blogExists = await Blog.findOne({ title: sanitizeText(title) });
    if (blogExists) {
        throw appError("Bài viết này đã tồn tại!", 400)
    }

    const imageUrls = await uploadImages(imageFiles, "guitar-shop/blogs");

    const newBlog = await Blog.create({
        title: sanitizeText(title),
        excerpt: sanitizeText(excerpt || ""),
        content: content.trim(),
        author: req.user._id,
        images: imageUrls
    })

    const populatedBlog = await Blog.findById(newBlog._id).populate("author", "name email")

    return appSuccess(res, {
        statusCode: 201,
        message: "Tạo bài viết mới thành công!",
        data: { newBlogs: populatedBlog }
    })
}

/**
 * Lấy danh sách tất cả bài viết (công khai).
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {200} Danh sách bài viết
 */
export const getAllBlogs = async (req, res) => {
    const blogs = await Blog.find()
        .populate("author", "name email")
        .sort({ createdAt: -1 });
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy tất cả bài viết thành công",
        data: { blogs }
    })
}

/**
 * Lấy chi tiết bài viết theo ID.
 * @param {Object} req - Request object chứa id trong params
 * @param {Object} res - Response object
 * @throws {400} ID không hợp lệ
 * @throws {404} Bài viết không tồn tại
 * @returns {200} Chi tiết bài viết
 */
export const getBlogsById = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw appError("ID bài viết không hợp lệ!", 400);
    }

    const blog = await Blog.findById(id).populate("author", "name email")
    if (!blog) {
        throw appError("Bài viết không tồn tại ", 404)
    }
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy bài viết thành công",
        data: {
            blog
        }
    })
}

/**
 * Cập nhật bài viết (admin). Hỗ trợ thay đổi banner image.
 * @param {Object} req - Request object chứa id trong params và dữ liệu cập nhật trong body
 * @param {Object} res - Response object
 * @throws {400} ID không hợp lệ
 * @throws {404} Bài viết không tồn tại
 * @returns {200} Bài viết đã cập nhật
 */
export const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, excerpt, content } = req.body;

    if (!isValidObjectId(id)) {
        throw appError("ID bài viết không hợp lệ!", 400);
    }

    const blog = await Blog.findById(id);
    if (!blog) {
        throw appError("Bài viết không tồn tại!", 404)
    }

    if (title) blog.title = sanitizeText(title);
    if (excerpt !== undefined) blog.excerpt = sanitizeText(excerpt);
    if (content) blog.content = content.trim();
    if (req.files && req.files.length > 0) {
        const imageUrls = await uploadImages(req.files, "guitar-shop/blogs");
        blog.images = imageUrls;
    }

    await blog.save();

    const populatedBlog = await Blog.findById(blog._id).populate("author", "name email")

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật bài viết thành công!",
        data: { blog: populatedBlog }
    })
}

/**
 * Xóa bài viết (admin).
 * @param {Object} req - Request object chứa id trong params
 * @param {Object} res - Response object
 * @throws {400} ID không hợp lệ
 * @throws {404} Bài viết không tồn tại
 * @returns {200} Thông báo xóa thành công
 */
export const deleteBlog = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID bài viết không hợp lệ!", 400);
    }

    const blog = await Blog.findById(id);
    if (!blog) {
        throw appError("Bài viết không tồn tại!", 404)
    }

    await Blog.findByIdAndDelete(id);

    return appSuccess(res, {
        statusCode: 200,
        message: "Xóa bài viết thành công!"
    })
}
