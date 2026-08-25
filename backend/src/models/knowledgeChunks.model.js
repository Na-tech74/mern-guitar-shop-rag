import mongoose from "mongoose";

const metadataSchema = new mongoose.Schema({
    type: {
        type: String,
        trim: true
    },
    category_ids: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Category",
        default: []
    },
    product_ids: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Product",
        default: []
    }
}, { _id: false });

const knowledgeChunkSchema = new mongoose.Schema({
    chunk_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    document_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },
    chunk_text: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
        default: []
    },
    metadata: {
        type: metadataSchema,
        default: {}
    },
    source_title: {
        type: String,
        trim: true,
        default: ""
    }
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

knowledgeChunkSchema.index({ document_id: 1 });

export default mongoose.model("KnowledgeChunk", knowledgeChunkSchema);
