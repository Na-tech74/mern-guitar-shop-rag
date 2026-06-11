import ContactContent from "../models/contactContent.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { uploadImages } from "../services/uploadImages.js";

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
