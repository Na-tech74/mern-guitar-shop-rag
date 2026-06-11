import mongoose from "mongoose";

const footerLinkSchema = new mongoose.Schema({
    label: { type: String, default: "" },
    path: { type: String, default: "" },
}, { _id: false });

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
