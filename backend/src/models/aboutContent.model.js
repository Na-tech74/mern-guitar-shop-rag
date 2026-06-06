/**
 * aboutContent.model.js
 * Schema lưu nội dung trang Giới thiệu (singleton - chỉ 1 document duy nhất).
 * Admin có thể chỉnh sửa mọi thứ hiển thị trên trang /about từ trang quản trị.
 */

import mongoose from "mongoose";

const aboutFeatureSchema = new mongoose.Schema({
    icon: {
        type: String,
        enum: ["music", "award", "users", "guitar", "headset", "gift", "shield", "star", "heart", "tag", "leaf"],
        default: "music"
    },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
}, { _id: false });

const aboutStatSchema = new mongoose.Schema({
    value: { type: String, default: "" },
    label: { type: String, default: "" },
}, { _id: false });

const aboutTeamMemberSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    role: { type: String, default: "" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
}, { _id: false });

const aboutContentSchema = new mongoose.Schema({
    // Breadcrumb / tiêu đề trang
    header: {
        breadcrumbLabel: { type: String, default: "Giới thiệu" },
    },

    // Tagline ngắn (dùng cho hero / meta description)
    intro: {
        tagline: {
            type: String,
            default: "Cửa hàng nhạc cụ hàng đầu Việt Nam, mang đến những sản phẩm chất lượng nhất cho đam mê âm nhạc của bạn."
        },
    },

    // Phần "Câu chuyện" - 1 đoạn văn + grid 2x2 ảnh
    story: {
        title: { type: String, default: "Câu chuyện của chúng tôi" },
        content: {
            type: String,
            default: "Nam Acoustic được thành lập với sứ mệnh mang âm nhạc đến gần hơn với mọi người. Chúng tôi tin rằng âm nhạc là ngôn ngữ chung của nhân loại, và mỗi cây đàn là một câu chuyện riêng. Với nhiều năm kinh nghiệm trong lĩnh vực nhạc cụ, chúng tôi tự hào là đối tác tin cậy của các nghệ sĩ, nhạc công và những người yêu nhạc trên khắp cả nước."
        },
        images: {
            type: [String],
            default: [
                "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
                "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
                "https://images.unsplash.com/photo-1555638138-cf515f3f0d6b?w=800&q=80",
                "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
            ]
        }
    },

    // Thống kê - 4 số liệu lớn
    stats: {
        items: {
            type: [aboutStatSchema],
            default: [
                { value: "10+", label: "Năm kinh nghiệm" },
                { value: "5000+", label: "Khách hàng" },
                { value: "500+", label: "Sản phẩm" },
                { value: "24/7", label: "Hỗ trợ" },
            ]
        }
    },

    // Đội ngũ - 4 thành viên
    team: {
        title: { type: String, default: "Đội ngũ của chúng tôi" },
        subtitle: { type: String, default: "Những con người tâm huyết đằng sau Nam Acoustic" },
        members: {
            type: [aboutTeamMemberSchema],
            default: [
                {
                    name: "Nam Nguyễn",
                    role: "Founder & CEO",
                    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
                    bio: "Đam mê guitar từ năm 12 tuổi, sáng lập Nam Acoustic với mong muốn chia sẻ tình yêu âm nhạc."
                },
                {
                    name: "Minh Trần",
                    role: "Chuyên gia sản phẩm",
                    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
                    bio: "Hơn 8 năm kinh nghiệm tư vấn nhạc cụ, am hiểu sâu về guitar và piano cổ điển."
                },
                {
                    name: "Linh Phạm",
                    role: "Trưởng phòng đào tạo",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
                    bio: "Nghệ sĩ piano giàu kinh nghiệm, chịu trách nhiệm phát triển các khóa học trực tuyến."
                },
                {
                    name: "Huy Lê",
                    role: "Hỗ trợ khách hàng",
                    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
                    bio: "Luôn sẵn sàng đồng hành cùng khách hàng 24/7 với sự nhiệt tình và chuyên nghiệp."
                },
            ]
        }
    },

    // Cam kết - 3 thẻ giá trị
    commitments: {
        title: { type: String, default: "Cam kết của chúng tôi" },
        subtitle: { type: String, default: "Giá trị cốt lõi định hình mọi hoạt động của Nam Acoustic" },
        items: {
            type: [aboutFeatureSchema],
            default: [
                {
                    icon: "shield",
                    title: "Chất lượng đặt lên hàng đầu",
                    description: "100% sản phẩm chính hãng, được tuyển chọn kỹ lưỡng từ những thương hiệu uy tín nhất thế giới."
                },
                {
                    icon: "heart",
                    title: "Khách hàng là trung tâm",
                    description: "Mỗi khách hàng đều được tư vấn tận tâm, hỗ trợ trước - trong - sau mua một cách chu đáo nhất."
                },
                {
                    icon: "star",
                    title: "Đổi mới không ngừng",
                    description: "Liên tục cập nhật sản phẩm, khóa học và dịch vụ mới để phục vụ cộng đồng yêu nhạc ngày càng tốt hơn."
                },
            ]
        }
    },
}, {
    timestamps: true
});

export default mongoose.model("AboutContent", aboutContentSchema);
