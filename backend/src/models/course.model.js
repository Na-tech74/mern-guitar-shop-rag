/**
 * course.model.js
 * Schema cho khóa học với danh sách bài học embedded.
 * Tự động tạo slug từ title khi tạo mới.
 */

import mongoose from "mongoose";

/**
 * Schema cho từng bài học trong khóa học
 * Embedded trong Course (không có collection riêng)
 */
const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    videoUrl: {
        type: String,
        default: ""
    },
    duration: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    order: {
        type: Number,
        default: 0
    }
}, { _id: true });

/**
 * Schema khóa học
 */
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    // URL-friendly identifier, tự động tạo từ title
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    thumbnail: {
        type: String,
        default: ""
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    instructor: {
        type: String,
        default: "Nam Acoustic"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    lessons: [lessonSchema],
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

/**
 * Pre-save hook: tự động tạo slug từ title
 * - Chuyển thành chữ thường, thay khoảng trắng/ký tự đặc biệt bằng dấu -
 * - Nếu slug bị trùng, thêm timestamp để đảm bảo unique
 */
courseSchema.pre("save", async function () {
    if (this.isModified("title") && !this.slug) {
        const baseSlug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        const existing = await this.constructor.findOne({ slug: baseSlug, _id: { $ne: this._id } });
        this.slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;
    }
});

export default mongoose.model("Course", courseSchema);
