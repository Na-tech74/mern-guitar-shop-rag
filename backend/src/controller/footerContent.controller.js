import FooterContent from "../models/footerContent.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";

export const getFooterContent = async (req, res) => {
    let content = await FooterContent.findOne();
    if (!content) {
        content = await FooterContent.create({});
    }
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy nội dung footer thành công!",
        data: { content }
    });
};

export const updateFooterContent = async (req, res) => {
    let content = await FooterContent.findOne();
    if (!content) {
        content = new FooterContent({});
    }

    const body = req.body || {};

    if (typeof body.description === "string") {
        content.description = body.description;
    }

    if (body.socialLinks) {
        const s = body.socialLinks;
        if (typeof s.facebook === "string") content.socialLinks.facebook = s.facebook;
        if (typeof s.instagram === "string") content.socialLinks.instagram = s.instagram;
        if (typeof s.youtube === "string") content.socialLinks.youtube = s.youtube;
        if (typeof s.tiktok === "string") content.socialLinks.tiktok = s.tiktok;
    }

    if (body.contactInfo) {
        const c = body.contactInfo;
        if (typeof c.address === "string") content.contactInfo.address = c.address;
        if (typeof c.phone === "string") content.contactInfo.phone = c.phone;
        if (typeof c.email === "string") content.contactInfo.email = c.email;
        if (typeof c.hours === "string") content.contactInfo.hours = c.hours;
    }

    if (Array.isArray(body.categories)) {
        content.categories = body.categories.map((item) => ({
            label: item.label || "",
            path: item.path || "",
        }));
    }

    if (Array.isArray(body.supportLinks)) {
        content.supportLinks = body.supportLinks.map((item) => ({
            label: item.label || "",
            path: item.path || "",
        }));
    }

    if (body.bottomBar) {
        const b = body.bottomBar;
        if (typeof b.copyrightText === "string") content.bottomBar.copyrightText = b.copyrightText;
        if (typeof b.showTerms === "boolean") content.bottomBar.showTerms = b.showTerms;
        if (typeof b.showPrivacy === "boolean") content.bottomBar.showPrivacy = b.showPrivacy;
    }

    await content.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật nội dung footer thành công!",
        data: { content }
    });
};
