/**
 * aboutContent.controller.js
 * Xử lý API lấy và cập nhật nội dung trang Giới thiệu (singleton).
 * - GET /api/about-content       : public
 * - PUT /api/about-content       : admin only
 * - POST /api/about-content/upload : admin only - upload 1 ảnh, trả về URL
 */

import AboutContent from "../models/aboutContent.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { uploadImages } from "../services/uploadImages.js";

/**
 * Lấy nội dung trang Giới thiệu. Nếu chưa có document thì tạo mới với dữ liệu mặc định.
 */
export const getAboutContent = async (req, res) => {
    let content = await AboutContent.findOne();
    if (!content) {
        content = await AboutContent.create({});
    }
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy nội dung trang giới thiệu thành công!",
        data: { content }
    });
};

/**
 * Cập nhật nội dung trang Giới thiệu (admin).
 * Chấp nhận JSON body để cập nhật các section.
 */
export const updateAboutContent = async (req, res) => {
    let content = await AboutContent.findOne();
    if (!content) {
        content = new AboutContent({});
    }

    const body = req.body || {};

    // Header
    if (body.header && typeof body.header.breadcrumbLabel === "string") {
        content.header.breadcrumbLabel = body.header.breadcrumbLabel;
    }

    // Intro
    if (body.intro && typeof body.intro.tagline === "string") {
        content.intro.tagline = body.intro.tagline;
    }

    // Story
    if (body.story) {
        const s = body.story;
        if (typeof s.title === "string") content.story.title = s.title;
        if (typeof s.content === "string") content.story.content = s.content;
        if (Array.isArray(s.images)) {
            content.story.images = s.images.map((url) => (typeof url === "string" ? url : ""));
        }
    }

    // Stats
    if (body.stats && Array.isArray(body.stats.items)) {
        content.stats.items = body.stats.items.map((s) => ({
            value: s.value || "",
            label: s.label || "",
        }));
    }

    // Team
    if (body.team) {
        const t = body.team;
        if (typeof t.title === "string") content.team.title = t.title;
        if (typeof t.subtitle === "string") content.team.subtitle = t.subtitle;
        if (Array.isArray(t.members)) {
            content.team.members = t.members.map((m) => ({
                name: m.name || "",
                role: m.role || "",
                avatar: m.avatar || "",
                bio: m.bio || "",
            }));
        }
    }

    // Commitments
    if (body.commitments) {
        const c = body.commitments;
        if (typeof c.title === "string") content.commitments.title = c.title;
        if (typeof c.subtitle === "string") content.commitments.subtitle = c.subtitle;
        if (Array.isArray(c.items)) {
            content.commitments.items = c.items.map((f) => ({
                icon: f.icon || "music",
                title: f.title || "",
                description: f.description || "",
            }));
        }
    }

    await content.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật nội dung trang giới thiệu thành công!",
        data: { content }
    });
};

/**
 * Upload 1 ảnh cho trang Giới thiệu (admin).
 * Trả về URL ảnh đã upload lên Cloudinary.
 */
export const uploadAboutImage = async (req, res) => {
    const file = req.file;
    if (!file) {
        throw appError("Vui lòng chọn file ảnh để tải lên!", 400);
    }
    const [url] = await uploadImages([file], "guitar-shop/about");
    return appSuccess(res, {
        statusCode: 201,
        message: "Upload ảnh thành công!",
        data: { url }
    });
};
