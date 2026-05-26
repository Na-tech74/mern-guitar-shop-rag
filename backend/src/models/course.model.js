import mongoose from "mongoose";

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

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
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
    },
    studentsCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

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
