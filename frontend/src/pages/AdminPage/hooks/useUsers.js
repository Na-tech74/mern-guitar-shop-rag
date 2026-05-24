import { useState, useEffect, useMemo, useCallback } from "react";
import { userAPI } from "../api/adminAPI";

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "user" });

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAll();
            setUsers(response.data?.data || []);
        } catch (err) {
            console.error("fetchUsers error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);



    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users || [];
        return (users || []).filter(user =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const openModal = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role || "user" });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const updateUser = async (id, data) => {
        try {
            await userAPI.update(id, data);
            await fetchUsers();
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || "Không thể cập nhật!");
        }
    };

    const deleteUser = async (id) => {
        try {
            await userAPI.delete(id);
            await fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || "Không thể xóa!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
        await deleteUser(id);
    };

    return {
        users,
        loading,
        fetchUsers,
        filteredUsers,
        searchTerm,
        setSearchTerm,
        updateUser,
        deleteUser,
        handleDelete,
        showModal,
        setShowModal,
        editingUser,
        setEditingUser,
        formData,
        setFormData,
        openModal,
        closeModal
    };
};