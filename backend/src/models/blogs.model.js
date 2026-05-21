import mongoose from "mongoose";

/**
 * Schema bài viết blog
 */
const blogSchema = new mongoose.Schema({
    // Tiêu đề bài viết (bắt buộc)
    title: {
        type: String,
        required: true,
        trim: true
    },
    // Đoạn trích / mô tả ngắn
    excerpt: {
        type: String,
        trim: true
    },
    // Nội dung đầy đủ (bắt buộc)
    content: {
        type: String,
        required: true
    },

    // Tham chiếu đến người dùng đã viết bài
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    // URL ảnh banner của bài viết
    images: {
        type:String,
        default:""
    },
}, {
    // Tự động quản lý createdAt / updatedAt
    timestamps: true
});

export default mongoose.model("blog", blogSchema);