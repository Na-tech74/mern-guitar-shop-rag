import { useState, useEffect, useCallback, useRef } from "react";
import { documentAPI, chatbotAPI } from "../../../api";
import { useDialog } from "../../../components/MessageDialog";

export default function useDocuments() {
    const { confirm, alert } = useDialog();

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);
    const [reindexing, setReindexing] = useState(false);
    const [formData, setFormData] = useState({
        document_id: "",
        title: "",
        type: "faq",
        content: "",
        status: "active",
        related_product_ids: [],
        related_category_ids: [],
    });

    const hasLoadedRef = useRef(false);

    const fetchDocuments = useCallback(async ({ silent = false } = {}) => {
        if (!silent) setLoading(true);
        setError(null);
        try {
            const res = await documentAPI.getAll();
            setDocuments(res.data?.data?.documents || []);
            hasLoadedRef.current = true;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && hasLoadedRef.current) {
                fetchDocuments({ silent: true });
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [fetchDocuments]);

    const createDocument = async (data) => {
        try {
            const res = await documentAPI.create(data);
            setDocuments(prev => [res.data.data.document, ...prev]);
            setError(null);
            return res.data.data.document;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const updateDocument = async (id, data) => {
        try {
            const res = await documentAPI.update(id, data);
            setDocuments(prev => prev.map(d => d._id === id ? res.data.data.document : d));
            setError(null);
            return res.data.data.document;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const deleteDocument = async (id) => {
        try {
            await documentAPI.delete(id);
            setDocuments(prev => prev.filter(d => d._id !== id));
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const reindex = async () => {
        try {
            setReindexing(true);
            const res = await chatbotAPI.reindex();
            const data = res.data?.data || res.data;
            await alert({
                title: "Reindex thành công",
                message: `Đã index ${data?.index_size || "?"} vectors. Chatbot đã được cập nhật kiến thức mới.`,
                variant: "success",
            });
        } catch (err) {
            await alert({
                title: "Lỗi reindex",
                message: err.response?.data?.message || err.message || "Không thể reindex",
                variant: "error",
            });
        } finally {
            setReindexing(false);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingDoc(null);
        setFormData({
            document_id: "",
            title: "",
            type: "faq",
            content: "",
            status: "active",
            related_product_ids: [],
            related_category_ids: [],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDoc) {
                await updateDocument(editingDoc._id, formData);
            } else {
                await createDocument(formData);
            }
            resetForm();
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra!";
            setError(msg);
            alert({ title: "Lỗi", message: msg, variant: "error" });
        }
    };

    const handleEdit = (doc) => {
        setEditingDoc(doc);
        setFormData({
            document_id: doc.document_id || "",
            title: doc.title || "",
            type: doc.type || "faq",
            content: doc.content || "",
            status: doc.status || "active",
            related_product_ids: doc.related_product_ids?.map(p => p._id || p) || [],
            related_category_ids: doc.related_category_ids?.map(c => c._id || c) || [],
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "Xóa tài liệu",
            message: "Bạn có chắc muốn xóa tài liệu này? Sau khi xóa cần reindex lại chatbot.",
            confirmText: "Xóa",
            variant: "danger",
        });
        if (ok) {
            await deleteDocument(id);
        }
    };

    const openForm = () => {
        resetForm();
        setShowForm(true);
    };

    return {
        documents, loading, error, setError,
        showForm, editingDoc, formData, setFormData,
        reindexing,
        handleSubmit, handleEdit, handleDelete,
        resetForm, openForm, reindex,
    };
}
