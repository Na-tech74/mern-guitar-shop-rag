import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { categoryAPI } from "../api/adminAPI";
import useDebounce from "../../../hooks/useDebounce";
import { useDialog } from "../../../components/ConfirmDialog";

export const useCategories = () => {
    const { confirm, alert } = useDialog();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "", image: "" });
    const [imagePreview, setImagePreview] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    // Theo dõi blob URL hiện tại của preview để revoke đúng lúc.
    const previewBlobRef = useRef(null);
    const hasLoadedRef = useRef(false);

    const fetchCategories = useCallback(async ({ silent = false } = {}) => {
        try {
            if (silent && hasLoadedRef.current) {
                setRefetching(true);
            } else {
                setLoading(true);
            }
            setError(null);
            const res = await categoryAPI.getAll();
            setCategories(res.data?.data?.categories || []);
            hasLoadedRef.current = true;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
            setRefetching(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && hasLoadedRef.current) {
                fetchCategories({ silent: true });
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [fetchCategories]);

    // Cleanup blob khi unmount.
    useEffect(() => {
        return () => {
            if (previewBlobRef.current) {
                URL.revokeObjectURL(previewBlobRef.current);
                previewBlobRef.current = null;
            }
        };
    }, []);

    const filteredCategories = useMemo(() => {
        if (!debouncedSearch) return categories || [];
        const term = debouncedSearch.toLowerCase();
        return (categories || []).filter((cat) => cat.name?.toLowerCase().includes(term));
    }, [categories, debouncedSearch]);

    const createCategory = useCallback(async (data) => {
        await categoryAPI.create(data);
        await fetchCategories({ silent: true });
    }, [fetchCategories]);

    const updateCategory = useCallback(async (id, data) => {
        await categoryAPI.update(id, data);
        await fetchCategories({ silent: true });
    }, [fetchCategories]);

    const deleteCategory = useCallback(async (id) => {
        await categoryAPI.delete(id);
        await fetchCategories({ silent: true });
    }, [fetchCategories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append("name", formData.name);
            fd.append("description", formData.description);
            if (selectedFile) {
                fd.append("image", selectedFile);
            } else if (editingCategory && formData.image) {
                fd.append("image", formData.image);
            }

            if (editingCategory) {
                await updateCategory(editingCategory._id, fd);
            } else {
                await createCategory(fd);
            }
            setShowModal(false);
            resetForm();
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Có lỗi xảy ra!",
                variant: "error",
            });
        }
    };

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "Xóa danh mục",
            message: "Bạn có chắc muốn xóa danh mục này?",
            confirmText: "Xóa",
            variant: "danger",
        });
        if (!ok) return;
        try {
            await deleteCategory(id);
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Có lỗi xảy ra!",
                variant: "error",
            });
        }
    };

    const handleEdit = (category) => {
        // Revoke blob cũ nếu có khi mở form mới.
        if (previewBlobRef.current) {
            URL.revokeObjectURL(previewBlobRef.current);
            previewBlobRef.current = null;
        }
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
            image: category.image || "",
        });
        setImagePreview(category.image || "");
        setSelectedFile(null);
        setShowModal(true);
    };

    const resetForm = () => {
        if (previewBlobRef.current) {
            URL.revokeObjectURL(previewBlobRef.current);
            previewBlobRef.current = null;
        }
        setEditingCategory(null);
        setFormData({ name: "", description: "", image: "" });
        setImagePreview("");
        setSelectedFile(null);
    };

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Revoke blob cũ trước khi tạo blob mới.
        if (previewBlobRef.current) {
            URL.revokeObjectURL(previewBlobRef.current);
        }
        const url = URL.createObjectURL(file);
        previewBlobRef.current = url;

        setSelectedFile(file);
        setImagePreview(url);
    };

    return {
        categories,
        loading,
        refetching,
        error,
        filteredCategories,
        searchTerm,
        setSearchTerm,
        createCategory,
        updateCategory,
        deleteCategory,
        handleSubmit,
        handleDelete,
        handleEdit,
        resetForm,
        openModal,
        showModal,
        setShowModal,
        editingCategory,
        setEditingCategory,
        formData,
        setFormData,
        imagePreview,
        handleImageChange,
    };
};
