/**
 * course.controller.js
 * Xử lý các API liên quan đến khóa học: tạo, lấy danh sách
 * (tất cả / đã xuất bản), chi tiết (ID / slug), cập nhật, xóa.
 * Hỗ trợ quản lý danh sách bài học (lessons) động.
 */

import Course from "../models/course.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { uploadImages } from "../services/uploadImages.js";
import { isValidObjectId } from "../utils/valid.js";
import { sanitizeText } from "../utils/format.js";

/**
 * Tạo khóa học mới (admin). Hỗ trợ upload thumbnail và thêm lessons.
 * Lessons được parse từ JSON string (nếu gửi từ form-data).
 */
export const createCourse = async (req, res) => {
    const { title, description, price, instructor, category, lessons, isPublished } = req.body;
    const thumbnailFile = req.file;

    if (!title || !description || !price) {
        throw appError("Vui lòng nhập đầy đủ thông tin khóa học!", 400);
    }

    const exist = await Course.findOne({ title: sanitizeText(title) });
    if (exist) {
        throw appError("Khóa học đã tồn tại!", 400);
    }

    let thumbnailUrl = "";
    if (thumbnailFile) {
        const urls = await uploadImages([thumbnailFile], "guitar-shop/courses");
        thumbnailUrl = urls[0] || "";
    }

    const parsedLessons = lessons ? (Array.isArray(lessons) ? lessons : JSON.parse(lessons)) : [];

    const course = await Course.create({
        title: sanitizeText(title),
        description: sanitizeText(description),
        price: Number(price),
        thumbnail: thumbnailUrl,
        instructor: instructor || "Nam Acoustic",
        category: category || undefined,
        lessons: parsedLessons.map((l, i) => ({ ...l, order: i })),
        isPublished: isPublished === true || isPublished === "true"
    });

    return appSuccess(res, {
        statusCode: 201,
        message: "Tạo khóa học thành công!",
        data: { course }
    });
};

/**
 * Lấy tất cả khóa học (admin). Bao gồm cả chưa xuất bản.
 */
export const getAllCourses = async (req, res) => {
    const { page = 1, limit = 10, category, search } = req.query;

    const query = {};
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh sách khóa học thành công!",
        data: {
            courses,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        }
    });
};

/**
 * Lấy danh sách khóa học đã xuất bản (công khai).
 * Chỉ trả về các khóa học có isPublished: true.
 */
export const getPublishedCourses = async (req, res) => {
    const { page = 1, limit = 10, category, search } = req.query;

    const query = { isPublished: true };
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh sách khóa học thành công!",
        data: {
            courses,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        }
    });
};

/**
 * Lấy chi tiết khóa học đã xuất bản theo slug (công khai).
 */
export const getCourseBySlug = async (req, res) => {
    const { slug } = req.params;

    const course = await Course.findOne({ slug, isPublished: true }).populate("category", "name");
    if (!course) {
        throw appError("Khóa học không tồn tại!", 404);
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy chi tiết khóa học thành công!",
        data: { course }
    });
};

/**
 * Lấy chi tiết khóa học theo ID (admin).
 * Bao gồm cả khóa học chưa xuất bản.
 */
export const getCourseById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID khóa học không hợp lệ!", 400);
    }

    const course = await Course.findById(id).populate("category", "name");
    if (!course) {
        throw appError("Khóa học không tồn tại!", 404);
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy chi tiết khóa học thành công!",
        data: { course }
    });
};

/**
 * Cập nhật khóa học (admin). Cho phép thay đổi thumbnail và lessons.
 */
export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, price, instructor, category, lessons, isPublished } = req.body;
    const thumbnailFile = req.file;

    if (!isValidObjectId(id)) {
        throw appError("ID khóa học không hợp lệ!", 400);
    }

    const course = await Course.findById(id);
    if (!course) {
        throw appError("Khóa học không tồn tại!", 404);
    }

    if (title) course.title = sanitizeText(title);
    if (description) course.description = sanitizeText(description);
    if (price) course.price = Number(price);
    if (instructor) course.instructor = instructor;
    if (category) course.category = category;
    if (isPublished !== undefined) course.isPublished = isPublished === true || isPublished === "true";

    if (thumbnailFile) {
        const urls = await uploadImages([thumbnailFile], "guitar-shop/courses");
        course.thumbnail = urls[0] || "";
    }

    if (lessons) {
        const parsed = Array.isArray(lessons) ? lessons : JSON.parse(lessons);
        course.lessons = parsed.map((l, i) => ({ ...l, order: i }));
    }

    await course.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật khóa học thành công!",
        data: { course }
    });
};

/**
 * Xóa khóa học (admin).
 */
export const deleteCourse = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID khóa học không hợp lệ!", 400);
    }

    const course = await Course.findById(id);
    if (!course) {
        throw appError("Khóa học không tồn tại!", 404);
    }

    await Course.findByIdAndDelete(id);

    return appSuccess(res, {
        statusCode: 200,
        message: "Xóa khóa học thành công!"
    });
};
