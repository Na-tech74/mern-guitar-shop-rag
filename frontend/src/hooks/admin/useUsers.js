import { useState, useCallback, useEffect } from "react";
import { userAPI } from "../../api/adminAPI";

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            const res = await userAPI.getAll();
            if (Array.isArray(res.data)) {
                setUsers(res.data);
            } else if (res.data && Array.isArray(res.data.data)) {
                setUsers(res.data.data);
            } else {
                setUsers([]);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const updateUser = useCallback(async (id, data) => {
        const res = await userAPI.update(id, data);
        refetch();
        return res;
    }, [refetch]);

    const deleteUser = useCallback(async (id) => {
        const res = await userAPI.delete(id);
        refetch();
        return res;
    }, [refetch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await updateUser(editingUser._id, formData);
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Có lỗi xảy ra!");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
        try {
            await deleteUser(id);
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Có lỗi xảy ra!");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            role: user.role || "user",
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingUser(null);
        setFormData({
            name: "",
            email: "",
            role: "user",
        });
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return {
        users,
        loading,
        error,
        refetch,
        updateUser,
        deleteUser,
        handleSubmit,
        handleDelete,
        handleEdit,
        resetForm,
        filteredUsers,
    };
};