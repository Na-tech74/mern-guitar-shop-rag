/**
 * homeContent.controller.js
 * Xử lý API lấy và cập nhật nội dung trang chủ (singleton).
 * - GET /api/home-content       : public
 * - PUT /api/home-content       : admin only
 * - POST /api/home-content/upload : admin only - upload 1 ảnh, trả về URL
 */

import HomeContent from "../models/homeContent.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { uploadImages } from "../services/uploadImages.js";
import { uploadVideos } from "../services/uploadVideos.js";

/**
 * Lấy nội dung trang chủ. Nếu chưa có document thì tạo mới với dữ liệu mặc định.
 */
export const getHomeContent = async (req, res) => {
    let content = await HomeContent.findOne();
    if (!content) {
        content = await HomeContent.create({});
    }
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy nội dung trang chủ thành công!",
        data: { content }
    });
};

/**
 * Cập nhật nội dung trang chủ (admin).
 * Chấp nhận JSON body để cập nhật các section, hoặc multipart để upload ảnh carousel/featuredTypes.
 */
export const updateHomeContent = async (req, res) => {
    let content = await HomeContent.findOne();
    if (!content) {
        content = new HomeContent({});
    }

    const body = req.body || {};

    // Carousel
    if (body.carousel) {
        if (typeof body.carousel.brand === "string") {
            content.carousel.brand = body.carousel.brand;
        }
        if (Array.isArray(body.carousel.slides)) {
            content.carousel.slides = body.carousel.slides.map((s) => ({
                title: s.title || "",
                subtitle: s.subtitle || "",
                description: s.description || "",
                image: s.image || "",
                cta: s.cta || "Xem thêm",
                path: s.path || "/products",
            }));
        }
    }

    // Features banner
    if (body.featuresBanner && Array.isArray(body.featuresBanner.features)) {
        content.featuresBanner.features = body.featuresBanner.features.map((f) => ({
            icon: f.icon || "truck",
            title: f.title || "",
            description: f.description || "",
        }));
    }

    // Categories section
    if (body.categoriesSection) {
        if (typeof body.categoriesSection.title === "string") {
            content.categoriesSection.title = body.categoriesSection.title;
        }
        if (typeof body.categoriesSection.subtitle === "string") {
            content.categoriesSection.subtitle = body.categoriesSection.subtitle;
        }
    }

    // Featured products section
    if (body.featuredProducts) {
        if (typeof body.featuredProducts.title === "string") {
            content.featuredProducts.title = body.featuredProducts.title;
        }
        if (typeof body.featuredProducts.subtitle === "string") {
            content.featuredProducts.subtitle = body.featuredProducts.subtitle;
        }
    }

    // Clip section
    if (body.clip) {
        const c = body.clip;
        if (typeof c.title === "string") content.clip.title = c.title;
        if (typeof c.description === "string") content.clip.description = c.description;
        if (typeof c.buttonText === "string") content.clip.buttonText = c.buttonText;
        if (typeof c.buttonLink === "string") content.clip.buttonLink = c.buttonLink;
        if (typeof c.videoUrl === "string") content.clip.videoUrl = c.videoUrl;
    }

    // Featured types
    if (body.featuredTypes) {
        if (typeof body.featuredTypes.title === "string") {
            content.featuredTypes.title = body.featuredTypes.title;
        }
        if (typeof body.featuredTypes.subtitle === "string") {
            content.featuredTypes.subtitle = body.featuredTypes.subtitle;
        }
        if (Array.isArray(body.featuredTypes.types)) {
            content.featuredTypes.types = body.featuredTypes.types.map((t) => ({
                title: t.title || "",
                subtitle: t.subtitle || "",
                image: t.image || "",
                link: t.link || "/products",
            }));
        }
    }

    // CTA section
    if (body.ctaSection) {
        const c = body.ctaSection;
        if (typeof c.badgeText === "string") content.ctaSection.badgeText = c.badgeText;
        if (typeof c.title === "string") content.ctaSection.title = c.title;
        if (typeof c.description === "string") content.ctaSection.description = c.description;
        if (typeof c.primaryButtonText === "string") content.ctaSection.primaryButtonText = c.primaryButtonText;
        if (typeof c.primaryButtonLink === "string") content.ctaSection.primaryButtonLink = c.primaryButtonLink;
        if (typeof c.secondaryButtonText === "string") content.ctaSection.secondaryButtonText = c.secondaryButtonText;
        if (typeof c.secondaryButtonLink === "string") content.ctaSection.secondaryButtonLink = c.secondaryButtonLink;
        if (typeof c.videoUrl === "string") content.ctaSection.videoUrl = c.videoUrl;
    }

    await content.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật nội dung trang chủ thành công!",
        data: { content }
    });
};

/**
 * Upload 1 ảnh cho trang chủ (admin).
 * Trả về URL ảnh đã upload lên Cloudinary.
 */
export const uploadHomeImage = async (req, res) => {
    const file = req.file;
    if (!file) {
        throw appError("Vui lòng chọn file ảnh để tải lên!", 400);
    }
    const [url] = await uploadImages([file], "guitar-shop/home");
    return appSuccess(res, {
        statusCode: 201,
        message: "Upload ảnh thành công!",
        data: { url }
    });
};

/**
 * Upload 1 video cho trang chủ (admin) - dùng cho clip khuyến mãi / CTA hỗ trợ.
 * Trả về URL video đã upload lên Cloudinary.
 */
export const uploadHomeVideo = async (req, res) => {
    const file = req.file;
    if (!file) {
        throw appError("Vui lòng chọn file video để tải lên!", 400);
    }
    const [url] = await uploadVideos([file], "guitar-shop/home/videos");
    return appSuccess(res, {
        statusCode: 201,
        message: "Upload video thành công!",
        data: { url }
    });
};
