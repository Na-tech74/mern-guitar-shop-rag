import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { userAPI } from "../../../api";
import useDebounce from "../../../hooks/useDebounce";
import { useDialog } from "../../../components/MessageDialog";

export const useUsers = () => {
    const { confirm, alert } = useDialog();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "user" });

    const hasLoadedRef = useRef(false);

    const fetchUsers = useCallback(async ({ silent = false } = {}) => {
        try {
            if (silent && hasLoadedRef.current) {
                setRefetching(true);
            } else {
                setLoading(true);
            }
            const response = await userAPI.getAll();
            setUsers(response.data?.data || []);
            hasLoadedRef.current = true;
        } catch (err) {
            console.error("fetchUsers error:", err);
        } finally {
            setLoading(false);
            setRefetching(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && hasLoadedRef.current) {
                fetchUsers({ silent: true });
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [fetchUsers]);

    const filteredUsers = useMemo(() => {
        if (!debouncedSearch) return users || [];
        const term = debouncedSearch.toLowerCase();
        return (users || []).filter(user =>
            user.name?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term)
        );
    }, [users, debouncedSearch]);

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
            await fetchUsers({ silent: true });
            closeModal();
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Không thể cập nhật!",
                variant: "error",
            });
        }
    };

    const deleteUser = async (id) => {
        try {
            await userAPI.delete(id);
            await fetchUsers({ silent: true });
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Không thể xóa!",
                variant: "error",
            });
        }
    };

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "Xóa người dùng",
            message: "Bạn có chắc muốn xóa người dùng này?",
            confirmText: "Xóa",
            variant: "danger",
        });
        if (!ok) return;
        await deleteUser(id);
    };

    return {
        users,
        loading,
        refetching,
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
