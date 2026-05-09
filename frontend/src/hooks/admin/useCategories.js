import { useState, useCallback, useEffect } from "react";
import { categoryAPI } from "../../api/adminAPI";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            const res = await categoryAPI.getAll();
            setCategories(res.data?.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const createCategory = useCallback(async (data) => {
        const res = await categoryAPI.create(data);
        refetch();
        return res;
    }, [refetch]);

    const updateCategory = useCallback(async (id, data) => {
        const res = await categoryAPI.update(id, data);
        refetch();
        return res;
    }, [refetch]);

    const deleteCategory = useCallback(async (id) => {
        const res = await categoryAPI.delete(id);
        refetch();
        return res;
    }, [refetch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory(editingCategory._id, formData);
            } else {
                await createCategory(formData);
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Có lỗi xảy ra!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        try {
            await deleteCategory(id);
        } catch (error) {
            console.error("Error deleting category:", error);
            alert("Có lỗi xảy ra!");
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingCategory(null);
        setFormData({
            name: "",
            description: "",
        });
    };

    const filteredCategories = categories.filter(cat =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };
    return {
        categories,
        loading,
        error,
        refetch,
        createCategory,
        updateCategory,
        deleteCategory,
        handleSubmit,
        handleDelete,
        handleEdit,
        resetForm,
        filteredCategories,
    };
};