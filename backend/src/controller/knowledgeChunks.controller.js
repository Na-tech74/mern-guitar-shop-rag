import KnowledgeChunk from "../models/knowledgeChunks.model.js";
import Document from "../models/documents.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { sanitizeText } from "../utils/format.js";
import { isValidObjectId } from "../utils/valid.js";

export const createChunk = async (req, res) => {
    const { chunk_id, document_id, chunk_text, embedding, metadata, source_title } = req.body;

    if (!chunk_id || !document_id || !chunk_text) {
        throw appError("Nhập đầy đủ thông tin chunk!", 400);
    }

    if (!isValidObjectId(document_id)) {
        throw appError("document_id không hợp lệ!", 400);
    }

    const doc = await Document.findById(document_id);
    if (!doc) {
        throw appError("Tài liệu gốc không tồn tại!", 404);
    }

    const chunkExists = await KnowledgeChunk.findOne({ chunk_id: sanitizeText(chunk_id) });
    if (chunkExists) {
        throw appError("Mã chunk đã tồn tại!", 400);
    }

    const newChunk = await KnowledgeChunk.create({
        chunk_id: sanitizeText(chunk_id),
        document_id,
        chunk_text: chunk_text.trim(),
        embedding: embedding || [],
        metadata: metadata || {},
        source_title: sanitizeText(source_title || doc.title)
    });

    const populatedChunk = await KnowledgeChunk.findById(newChunk._id)
        .populate("document_id", "document_id title type");

    return appSuccess(res, {
        statusCode: 201,
        message: "Tạo chunk thành công!",
        data: { chunk: populatedChunk }
    });
};

export const getAllChunks = async (req, res) => {
    const { document_id, type, search } = req.query;

    const filter = {};
    if (document_id) {
        if (!isValidObjectId(document_id)) {
            throw appError("document_id không hợp lệ!", 400);
        }
        filter.document_id = document_id;
    }
    if (type) filter["metadata.type"] = type;
    if (search) {
        filter.$or = [
            { chunk_text: { $regex: search, $options: "i" } },
            { source_title: { $regex: search, $options: "i" } }
        ];
    }

    const chunks = await KnowledgeChunk.find(filter)
        .populate("document_id", "document_id title type")
        .sort({ updated_at: -1 });

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh sách chunk thành công!",
        data: { chunks }
    });
};

export const getChunkById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID chunk không hợp lệ!", 400);
    }

    const chunk = await KnowledgeChunk.findById(id)
        .populate("document_id", "document_id title type");

    if (!chunk) {
        throw appError("Chunk không tồn tại!", 404);
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy chunk thành công!",
        data: { chunk }
    });
};

export const getChunksByDocument = async (req, res) => {
    const { documentId } = req.params;

    if (!isValidObjectId(documentId)) {
        throw appError("document_id không hợp lệ!", 400);
    }

    const chunks = await KnowledgeChunk.find({ document_id: documentId })
        .populate("document_id", "document_id title type")
        .sort({ updated_at: -1 });

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy chunks theo tài liệu thành công!",
        data: { chunks }
    });
};

export const updateChunk = async (req, res) => {
    const { id } = req.params;
    const { chunk_id, chunk_text, embedding, metadata, source_title } = req.body;

    if (!isValidObjectId(id)) {
        throw appError("ID chunk không hợp lệ!", 400);
    }

    const chunk = await KnowledgeChunk.findById(id);
    if (!chunk) {
        throw appError("Chunk không tồn tại!", 404);
    }

    if (chunk_id && chunk_id !== chunk.chunk_id) {
        const duplicate = await KnowledgeChunk.findOne({ chunk_id: sanitizeText(chunk_id) });
        if (duplicate) {
            throw appError("Mã chunk đã tồn tại!", 400);
        }
        chunk.chunk_id = sanitizeText(chunk_id);
    }

    if (chunk_text) chunk.chunk_text = chunk_text.trim();
    if (embedding !== undefined) chunk.embedding = embedding;
    if (metadata !== undefined) chunk.metadata = metadata;
    if (source_title !== undefined) chunk.source_title = sanitizeText(source_title);

    await chunk.save();

    const populatedChunk = await KnowledgeChunk.findById(chunk._id)
        .populate("document_id", "document_id title type");

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật chunk thành công!",
        data: { chunk: populatedChunk }
    });
};

export const deleteChunk = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID chunk không hợp lệ!", 400);
    }

    const chunk = await KnowledgeChunk.findById(id);
    if (!chunk) {
        throw appError("Chunk không tồn tại!", 404);
    }

    await KnowledgeChunk.findByIdAndDelete(id);

    return appSuccess(res, {
        statusCode: 200,
        message: "Xóa chunk thành công!"
    });
};

export const deleteChunksByDocument = async (req, res) => {
    const { documentId } = req.params;

    if (!isValidObjectId(documentId)) {
        throw appError("document_id không hợp lệ!", 400);
    }

    const result = await KnowledgeChunk.deleteMany({ document_id: documentId });

    return appSuccess(res, {
        statusCode: 200,
        message: `Đã xóa ${result.deletedCount} chunk!`
    });
};
