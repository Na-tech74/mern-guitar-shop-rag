import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    document_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ["product_guide", "faq", "policy", "manual"],
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    related_product_ids: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Product",
        default: []
    },
    related_category_ids: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Category",
        default: []
    },
    status: {
        type: String,
        enum: ["active", "hidden", "needs_update"],
        default: "active"
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
}, {
    timestamps: true
});

export default mongoose.model("Document", documentSchema);
