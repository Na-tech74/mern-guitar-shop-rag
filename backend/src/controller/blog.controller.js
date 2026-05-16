import blogModel from "../models/blogs.model.js";
import { appError } from "../utils/appError.js";
import { uploadImages } from "../services/uploadImages.js";
import { formatSuccessResponse, sanitizeText } from "../utils/format.js";
import { isValidObjectId } from "../utils/vaildate.js";

export const createBlog = async (req, res) => {
    const { title, content, excerpt, banner, isPublished } = req.body;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!title || !content) {
        throw appError("Nhập đầy đủ thông tin bài viết!", 400);
    }

    const newBlog = await blogModel.create({
        title: sanitizeText(title),
        excerpt: excerpt ? sanitizeText(excerpt) : "",
        content,
        banner,
        isPublished: isPublished || false,
        author: req.user._id
    });

    return res.status(201).json(formatSuccessResponse(
        'Bài viết đã được tạo thành công!',
        newBlog
    ));
};

export const getAllBlogs = async (req, res) => {
    const blogs = await blogModel.find().sort({ createdAt: -1 });
    
    return res.json({
        status: 'success',
        message: 'Danh sách bài viết!',
        data: blogs
    });
};

export const getBlogById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID bài viết không hợp lệ!", 400);
    }

    const blog = await blogModel
        .findById(id)
        .populate('author', 'name email');

    if (!blog) {
        throw appError("Bài viết không tồn tại!", 404);
    }

    return res.json(formatSuccessResponse(
        'Bài viết đã được lấy thành công!',
        blog
    ));
};

export const getBlogBySlug = async (req, res) => {
    const { slug } = req.params;

    const blog = await blogModel
        .findOne({ slug })
        .populate('author', 'name email');

    if (!blog) {
        throw appError("Bài viết không tồn tại!", 404);
    }

    return res.json(formatSuccessResponse(
        'Bài viết đã được lấy thành công!',
        blog
    ));
};

export const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content, excerpt, banner, isPublished } = req.body;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID bài viết không hợp lệ!", 400);
    }

    const blog = await blogModel.findById(id);
    if (!blog) {
        throw appError("Bài viết không tồn tại!", 404);
    }

    if (title && title !== blog.title) {
        const existingBlog = await blogModel.findOne({
            title: sanitizeText(title),
            _id: { $ne: id }
        });
        if (existingBlog) {
            throw appError("Tiêu đề bài viết đã tồn tại!", 400);
        }
        blog.title = sanitizeText(title);
    }

    if (content) blog.content = content;
    if (excerpt) blog.excerpt = sanitizeText(excerpt);
    if (banner !== undefined) blog.banner = banner;
    if (isPublished !== undefined) blog.isPublished = isPublished;

    await blog.save();

    return res.json(formatSuccessResponse(
        'Bài viết đã được cập nhật thành công!',
        blog
    ));
};

export const deleteBlog = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID bài viết không hợp lệ!", 400);
    }

    const blog = await blogModel.findById(id);
    if (!blog) {
        throw appError("Bài viết không tồn tại!", 404);
    }

    await blog.deleteOne();

    return res.json(formatSuccessResponse(
        'Bài viết đã được xóa thành công!'
    ));
};

export const uploadBlogBanner = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID bài viết không hợp lệ!", 400);
    }

    if (!req.files || req.files.length === 0) {
        throw appError("Không có tệp nào được tải lên!", 400);
    }

    const blog = await blogModel.findById(id);
    if (!blog) {
        throw appError("Bài viết không tồn tại!", 404);
    }

    const uploadedImages = await uploadImages(req.files, "guitar-shop/blogs");
    blog.banner = uploadedImages[0];
    await blog.save();

    return res.json(formatSuccessResponse(
        'Banner đã được tải lên thành công!',
        { banner: blog.banner }
    ));
};

export const uploadBlogBannerDirect = async (req, res) => {
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!req.file) {
        throw appError("Không có tệp nào được tải lên!", 400);
    }

    const uploadedImages = await uploadImages([req.file], "guitar-shop/blogs");
    
    return res.json(formatSuccessResponse(
        'Banner đã được tải lên thành công!',
        { banner: uploadedImages[0] }
    ));
};