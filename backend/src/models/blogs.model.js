import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    excerpt: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    banner: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model("blog", blogSchema);