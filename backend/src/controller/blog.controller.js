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
 */
export const createBlog = async (req, res) => {
    const { title, excerpt, content } = req.body;
    const imageFiles = req.files;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403)
    }

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

    // Upload ảnh lên Cloudinary (thư mục: guitar-shop/blogs)
    const imageUrls = await uploadImages(imageFiles, "guitar-shop/blogs");

    const newBlog = await Blog.create({
        title: sanitizeText(title),
        excerpt: sanitizeText(excerpt || ""),
        content: sanitizeText(content),
        author: req.user._id,
        images: imageUrls
    })

    // Populate author để trả về thông tin tên, email thay vì ObjectId
    const populatedBlog = await Blog.findById(newBlog._id).populate("author", "name email")

    return appSuccess(res, {
        statusCode: 201,
        message: "Tạo bài viết mới thành công!",
        data: { newBlogs: populatedBlog }
    })
}

/**
 * Lấy danh sách tất cả bài viết (công khai).
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
 */
export const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, excerpt, content } = req.body;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403)
    }

    if (!isValidObjectId(id)) {
        throw appError("ID bài viết không hợp lệ!", 400);
    }

    const blog = await Blog.findById(id);
    if (!blog) {
        throw appError("Bài viết không tồn tại!", 404)
    }

    if (title) blog.title = sanitizeText(title);
    if (excerpt !== undefined) blog.excerpt = sanitizeText(excerpt);
    if (content) blog.content = sanitizeText(content);
    if (req.file) {
        const [urls] = await uploadImages([req.file], "guitar-shop/blogs");
        blog.images = urls;
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
 */
export const deleteBlog = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403)
    }

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
