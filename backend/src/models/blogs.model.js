/**
 * blogs.model.js
 * Schema cho bài viết blog
 * Lưu trữ tiêu đề, đoạn trích, nội dung, tác giả và danh sách ảnh
 */

import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    excerpt: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    images: {
        type: [String],
        default: []
    },
}, {
    timestamps: true
});

export default mongoose.model("blog", blogSchema);
