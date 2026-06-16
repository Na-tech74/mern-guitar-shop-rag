/**
 * footerContent.model.js
 * Model Mongoose cho nội dung footer (singleton)
 * Lưu trữ mô tả, liên kết mạng xã hội, thông tin liên hệ, danh mục, liên kết hỗ trợ và thanh bottom bar
 */

import mongoose from "mongoose";

/**
 * Schema cho một liên kết trong danh sách (danh mục / hỗ trợ)
 * @property {String} label - Tên hiển thị
 * @property {String} path - Đường dẫn
 */
const footerLinkSchema = new mongoose.Schema({
    label: { type: String, default: "" },
    path: { type: String, default: "" },
}, { _id: false });

/**
 * Schema tổng thể cho nội dung footer
 * @property {String} description - Mô tả cửa hàng
 * @property {Object} socialLinks - Liên kết mạng xã hội (facebook, instagram, youtube, tiktok)
 * @property {Object} contactInfo - Thông tin liên hệ (address, phone, email, hours)
 * @property {Array} categories - Danh mục sản phẩm
 * @property {Array} supportLinks - Liên kết hỗ trợ
 * @property {Object} bottomBar - Cấu hình thanh dưới cùng (copyright, hiển thị điều khoản/chính sách)
 */
const footerContentSchema = new mongoose.Schema({
    description: {
        type: String,
        default: "Nam Acoustic là cửa hàng nhạc cụ hàng đầu tại TP.HCM, chuyên cung cấp đàn guitar acoustic, classic và electric chất lượng cao từ các thương hiệu uy tín trên thế giới."
    },
    socialLinks: {
        facebook: { type: String, default: "https://facebook.com" },
        instagram: { type: String, default: "https://instagram.com" },
        youtube: { type: String, default: "https://youtube.com" },
        tiktok: { type: String, default: "https://tiktok.com" },
    },
    contactInfo: {
        address: { type: String, default: "537/1 An Phú Đông, Q12, TP. Hồ Chí Minh" },
        phone: { type: String, default: "0378623181" },
        email: { type: String, default: "namn98561@gmail.com" },
        hours: { type: String, default: "T2–CN: 8:00–22:00" },
    },
    categories: {
        type: [footerLinkSchema],
        default: [
            { label: "Trang chủ", path: "/" },
            { label: "Sản phẩm", path: "/products" },
            { label: "Khóa học", path: "/courses" },
            { label: "Giới thiệu", path: "/about" },
            { label: "Liên hệ", path: "/contact" },
        ]
    },
    supportLinks: {
        type: [footerLinkSchema],
        default: [
            { label: "Câu hỏi thường gặp", path: "/faq" },
            { label: "Chính sách giao hàng", path: "/shipping" },
            { label: "Chính sách đổi trả", path: "/return" },
            { label: "Bảo hành sản phẩm", path: "/warranty" },
            { label: "Chính sách bảo mật", path: "/privacy" },
        ]
    },
    bottomBar: {
        copyrightText: {
            type: String,
            default: "© 2026 Nam Acoustic. No copyright design by Nam Nguyễn"
        },
        showTerms: { type: Boolean, default: true },
        showPrivacy: { type: Boolean, default: true },
    },
}, { timestamps: true });

export default mongoose.model("FooterContent", footerContentSchema);
