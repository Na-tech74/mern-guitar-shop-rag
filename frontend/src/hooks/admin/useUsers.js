import { useState, useEffect, useMemo } from "react";
import { userAPI } from "../../api/adminAPI";

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "user" });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAll();
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

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
            console.error("Error updating user:", err);
        }
    };

    const deleteUser = async (id) => {
        try {
            await userAPI.delete(id);
            await fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    return {
        users,
        loading,
        error,
        filteredUsers,
        searchTerm,
        setSearchTerm,
        updateUser,
        deleteUser,
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