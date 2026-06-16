import TermsContent from "../models/termsContent.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";

export const getTermsContent = async (req, res) => {
    let content = await TermsContent.findOne();
    if (!content) {
        content = await TermsContent.create({});
    }
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy nội dung trang điều khoản thành công!",
        data: { content }
    });
};

export const updateTermsContent = async (req, res) => {
    let content = await TermsContent.findOne();
    if (!content) {
        content = new TermsContent({});
    }

    const body = req.body || {};

    if (body.header) {
        if (typeof body.header.title === "string") content.header.title = body.header.title;
        if (typeof body.header.lastUpdated === "string") content.header.lastUpdated = body.header.lastUpdated;
    }

    if (Array.isArray(body.sections)) {
        content.sections = body.sections.map((s) => ({
            title: s.title || "",
            content: s.content || "",
        }));
    }

    await content.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật nội dung trang điều khoản thành công!",
        data: { content }
    });
};
