/**
 * homeContent.model.js
 * Schema lưu nội dung trang chủ (singleton - chỉ 1 document duy nhất).
 * Admin có thể chỉnh sửa mọi thứ hiển thị trên trang chủ từ trang quản trị.
 */

import mongoose from "mongoose";

const carouselSlideSchema = new mongoose.Schema({
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    cta: { type: String, default: "Xem thêm" },
    path: { type: String, default: "/products" },
}, { _id: false });

const featureItemSchema = new mongoose.Schema({
    icon: {
        type: String,
        enum: ["truck", "shield", "headset", "award", "gift", "rotate"],
        default: "truck"
    },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
}, { _id: false });

const featuredTypeSchema = new mongoose.Schema({
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    image: { type: String, default: "" },
    link: { type: String, default: "/products" },
}, { _id: false });

const homeContentSchema = new mongoose.Schema({
    // Carousel / banner đầu trang
    carousel: {
        brand: { type: String, default: "Nam Acoustic" },
        slides: {
            type: [carouselSlideSchema],
            default: [
                {
                    title: "Guitar Acoustic Cao Cấp",
                    subtitle: "Chất lượng âm thanh tuyệt vời cho mọi không gian",
                    description: "Khám phá bộ sưu tập guitar acoustic cao cấp với thiết kế tinh xảo và âm thanh sống động",
                    image: "https://res.cloudinary.com/dsh9anp7p/image/upload/w_1920,q_auto,f_auto/v1778735126/guitar-shop/tpyifrrwagyagalzdhhy.jpg",
                    cta: "Mua ngay",
                    path: "/products"
                },
                {
                    title: "Piano Chính Hãng",
                    subtitle: "Biểu diễn chuyên nghiệp với âm thanh hoàn hảo",
                    description: "Bộ sưu tập piano điện tử và acoustic từ các thương hiệu nổi tiếng thế giới",
                    image: "https://res.cloudinary.com/dsh9anp7p/image/upload/w_1920,q_auto,f_auto/v1778735619/guitar-shop/cwpqdps56lmbb4bdg2ye.jpg",
                    cta: "Khám phá",
                    path: "/products"
                },
                {
                    title: "Ukulele & Nhạc Cụ",
                    subtitle: "Học nhạc cùng giáo viên chuyên nghiệp",
                    description: "Đăng ký khóa học guitar, piano, violin và nhiều nhạc cụ khác với giáo viên giàu kinh nghiệm",
                    image: "https://res.cloudinary.com/dsh9anp7p/image/upload/w_1920,q_auto,f_auto/v1778735833/guitar-shop/dj7rhxldvz3jayu42qhg.jpg",
                    cta: "Đăng ký ngay",
                    path: "/products"
                },
            ]
        }
    },

    // Banner 4 tính năng
    featuresBanner: {
        features: {
            type: [featureItemSchema],
            default: [
                { icon: "truck", title: "Giao hàng nhanh", description: "Miễn phí giao hàng toàn quốc với đơn từ 500K" },
                { icon: "shield", title: "Bảo hành chính hãng", description: "Bảo hành lên đến 24 tháng cho tất cả sản phẩm" },
                { icon: "headset", title: "Hỗ trợ 24/7", description: "Đội ngũ tư vấn chuyên nghiệp mọi lúc" },
                { icon: "award", title: "Sản phẩm chất lượng", description: "Cam kết 100% sản phẩm chính hãng" },
            ]
        }
    },

    // Section danh mục
    categoriesSection: {
        title: { type: String, default: "Danh mục sản phẩm" },
        subtitle: { type: String, default: "Lựa chọn danh mục phù hợp với nhu cầu của bạn" },
    },

    // Section sản phẩm nổi bật
    featuredProducts: {
        title: { type: String, default: "Sản Phẩm Nổi Bật" },
        subtitle: { type: String, default: "Mang đến cho khách hàng những cây đàn chất lượng nhất" },
    },

    // Section clip khuyến mãi
    clip: {
        title: { type: String, default: "Giảm giá lên đến 30%" },
        description: { type: String, default: "Dành cho khách hàng mua lần đầu. Áp dụng cho tất cả sản phẩm guitar acoustic và classic." },
        buttonText: { type: String, default: "Mua ngay" },
        buttonLink: { type: String, default: "/products" },
        videoUrl: { type: String, default: "" },
    },

    // Section bộ sưu tập
    featuredTypes: {
        title: { type: String, default: "Bộ sưu tập" },
        subtitle: { type: String, default: "Khám phá các dòng guitar phổ biến nhất" },
        types: {
            type: [featuredTypeSchema],
            default: [
                {
                    title: "Guitar Acoustic",
                    subtitle: "Đa dạng mẫu mã",
                    image: "https://res.cloudinary.com/dsh9anp7p/image/upload/v1778732551/guitar-shop/blogs/rnrmbpbtrjlqiyrpc9f9.jpg",
                    link: "/products"
                },
                {
                    title: "Guitar Classic",
                    subtitle: "Thiết kế sang trọng",
                    image: "https://res.cloudinary.com/dsh9anp7p/image/upload/v1779347115/guitar-shop/blogs/xgdfhlwkckxxftyeetrn.jpg",
                    link: "/products"
                },
                {
                    title: "Ukulele",
                    subtitle: "Nhỏ gọn, tiện lợi",
                    image: "https://res.cloudinary.com/dsh9anp7p/image/upload/v1779346001/guitar-shop/products/lsyl4pypymtcuxf5lzca.jpg",
                    link: "/products"
                },
            ]
        }
    },

    // Section CTA hỗ trợ
    ctaSection: {
        badgeText: { type: String, default: "Hỗ trợ 24/7" },
        title: { type: String, default: "Bạn cần tư vấn?" },
        description: { type: String, default: "Đội ngũ chuyên viên của chúng tôi sẵn sàng hỗ trợ bạn 24/7 với mọi thắc mắc về nhạc cụ" },
        primaryButtonText: { type: String, default: "Xem sản phẩm" },
        primaryButtonLink: { type: String, default: "/products" },
        secondaryButtonText: { type: String, default: "Liên hệ ngay" },
        secondaryButtonLink: { type: String, default: "/contact" },
        videoUrl: { type: String, default: "" },
    },
}, {
    timestamps: true
});

export default mongoose.model("HomeContent", homeContentSchema);
