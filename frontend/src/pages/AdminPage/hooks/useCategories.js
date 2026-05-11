import { useState, useCallback, useEffect, useMemo } from "react";
import { categoryAPI } from "../api/adminAPI";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "" });

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const res = await categoryAPI.getAll();
            setCategories(res.data?.data || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const filteredCategories = useMemo(() => {
        if (!searchTerm) return categories || [];
        return (categories || []).filter(cat =>
            cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    const createCategory = useCallback(async (data) => {
        try {
            await categoryAPI.create(data);
            await fetchCategories();
        } catch (err) {
            throw err;
        }
    }, [fetchCategories]);

    const updateCategory = useCallback(async (id, data) => {
        try {
            await categoryAPI.update(id, data);
            await fetchCategories();
        } catch (err) {
            throw err;
        }
    }, [fetchCategories]);

    const deleteCategory = useCallback(async (id) => {
        try {
            await categoryAPI.delete(id);
            await fetchCategories();
        } catch (err) {
            throw err;
        }
    }, [fetchCategories]);

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
            alert("Có lỗi xảy ra!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa?")) return;
        try {
            await deleteCategory(id);
        } catch (error) {
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
        setFormData({ name: "", description: "" });
    };

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    return {
        categories,
        loading,
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
    };
};