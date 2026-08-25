import Document from "../models/documents.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { sanitizeText } from "../utils/format.js";
import { isValidObjectId } from "../utils/valid.js";

export const createDocument = async (req, res) => {
    const { document_id, title, type, content, related_product_ids, related_category_ids, status } = req.body;

    if (!document_id || !title || !type || !content) {
        throw appError("Nhập đầy đủ thông tin tài liệu!", 400);
    }

    const docExists = await Document.findOne({ document_id: sanitizeText(document_id) });
    if (docExists) {
        throw appError("Mã tài liệu đã tồn tại!", 400);
    }

    const newDoc = await Document.create({
        document_id: sanitizeText(document_id),
        title: sanitizeText(title),
        type,
        content: content.trim(),
        related_product_ids: related_product_ids || [],
        related_category_ids: related_category_ids || [],
        status: status || "active",
        created_by: req.user._id
    });

    const populatedDoc = await Document.findById(newDoc._id)
        .populate("created_by", "name email")
        .populate("related_product_ids", "name")
        .populate("related_category_ids", "name");

    return appSuccess(res, {
        statusCode: 201,
        message: "Tạo tài liệu thành công!",
        data: { document: populatedDoc }
    });
};

export const getAllDocuments = async (req, res) => {
    const { type, status, search } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { document_id: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } }
        ];
    }

    const documents = await Document.find(filter)
        .populate("created_by", "name email")
        .populate("related_product_ids", "name")
        .populate("related_category_ids", "name")
        .sort({ createdAt: -1 });

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh sách tài liệu thành công!",
        data: { documents }
    });
};

export const getDocumentById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID tài liệu không hợp lệ!", 400);
    }

    const document = await Document.findById(id)
        .populate("created_by", "name email")
        .populate("related_product_ids", "name")
        .populate("related_category_ids", "name");

    if (!document) {
        throw appError("Tài liệu không tồn tại!", 404);
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy tài liệu thành công!",
        data: { document }
    });
};

export const updateDocument = async (req, res) => {
    const { id } = req.params;
    const { document_id, title, type, content, related_product_ids, related_category_ids, status } = req.body;

    if (!isValidObjectId(id)) {
        throw appError("ID tài liệu không hợp lệ!", 400);
    }

    const document = await Document.findById(id);
    if (!document) {
        throw appError("Tài liệu không tồn tại!", 404);
    }

    if (document_id && document_id !== document.document_id) {
        const duplicate = await Document.findOne({ document_id: sanitizeText(document_id) });
        if (duplicate) {
            throw appError("Mã tài liệu đã tồn tại!", 400);
        }
        document.document_id = sanitizeText(document_id);
    }

    if (title) document.title = sanitizeText(title);
    if (type) document.type = type;
    if (content) document.content = content.trim();
    if (related_product_ids !== undefined) document.related_product_ids = related_product_ids;
    if (related_category_ids !== undefined) document.related_category_ids = related_category_ids;
    if (status) document.status = status;

    await document.save();

    const populatedDoc = await Document.findById(document._id)
        .populate("created_by", "name email")
        .populate("related_product_ids", "name")
        .populate("related_category_ids", "name");

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật tài liệu thành công!",
        data: { document: populatedDoc }
    });
};

export const deleteDocument = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID tài liệu không hợp lệ!", 400);
    }

    const document = await Document.findById(id);
    if (!document) {
        throw appError("Tài liệu không tồn tại!", 404);
    }

    await Document.findByIdAndDelete(id);

    return appSuccess(res, {
        statusCode: 200,
        message: "Xóa tài liệu thành công!"
    });
};
