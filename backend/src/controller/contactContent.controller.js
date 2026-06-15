/**
 * contactContent.controller.js
 * Xử lý các API liên quan đến nội dung trang liên hệ: lấy, cập nhật, upload hình ảnh
 */

import ContactContent from "../models/contactContent.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { uploadImages } from "../services/uploadImages.js";

/**
 * Lấy nội dung trang liên hệ (singleton - tự động tạo nếu chưa có)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @throws {404} Không tìm thấy nội dung
 * @returns {200} Nội dung trang liên hệ
 */
export const getContactContent = async (req, res) => {
    let content = await ContactContent.findOne();
    if (!content) {
        content = await ContactContent.create({});
    }
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy nội dung trang liên hệ thành công!",
        data: { content }
    });
};

/**
 * Cập nhật nội dung trang liên hệ
 * @param {Object} req - Request object chứa dữ liệu cập nhật trong body
 * @param {Object} res - Response object
 * @returns {200} Nội dung đã cập nhật
 */
export const updateContactContent = async (req, res) => {
    let content = await ContactContent.findOne();
    if (!content) {
        content = new ContactContent({});
    }

    const body = req.body || {};

    if (body.header) {
        if (typeof body.header.title === "string") content.header.title = body.header.title;
        if (typeof body.header.subtitle === "string") content.header.subtitle = body.header.subtitle;
    }

    if (body.socialLinks) {
        const s = body.socialLinks;
        if (typeof s.facebook === "string") content.socialLinks.facebook = s.facebook;
        if (typeof s.instagram === "string") content.socialLinks.instagram = s.instagram;
        if (typeof s.youtube === "string") content.socialLinks.youtube = s.youtube;
    }

    if (typeof body.mapEmbedUrl === "string") {
        content.mapEmbedUrl = body.mapEmbedUrl;
    }

    if (Array.isArray(body.contactInfo)) {
        content.contactInfo = body.contactInfo.map((c) => ({
            icon: c.icon || "map",
            label: c.label || "",
            value: c.value || "",
        }));
    }

    await content.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật nội dung trang liên hệ thành công!",
        data: { content }
    });
};

/**
 * Upload hình ảnh cho trang liên hệ
 * @param {Object} req - Request object chứa file ảnh trong req.file (field name: "image")
 * @param {Object} res - Response object
 * @throws {400} Không có file ảnh
 * @returns {201} URL ảnh đã upload
 */
export const uploadContactImage = async (req, res) => {
    const file = req.file;
    if (!file) {
        throw appError("Vui lòng chọn file ảnh để tải lên!", 400);
    }
    const [url] = await uploadImages([file], "guitar-shop/contact");
    return appSuccess(res, {
        statusCode: 201,
        message: "Upload ảnh thành công!",
        data: { url }
    });
};
