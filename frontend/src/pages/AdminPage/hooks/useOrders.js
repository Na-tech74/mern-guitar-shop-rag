import { useState, useCallback, useEffect, useMemo } from "react";
import { orderAPI } from "../api/adminAPI";

const STATUS_LIST = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = useCallback(async (page = 1, status = "") => {
        try {
            setLoading(true);
            setError(null);
            const params = { page, limit: 10 };
            if (status) params.status = status;
            const res = await orderAPI.getAll(params);
            const data = res.data?.data;
            setOrders(data?.orders || []);
            setPagination({
                page: data?.page || 1,
                pages: data?.pages || 1,
                total: data?.total || 0
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(1, statusFilter === "all" ? "" : statusFilter);
    }, [fetchOrders, statusFilter]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                fetchOrders(pagination.page, statusFilter === "all" ? "" : statusFilter);
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [fetchOrders, pagination.page, statusFilter]);

    const handlePageChange = useCallback((page) => {
        fetchOrders(page, statusFilter === "all" ? "" : statusFilter);
    }, [fetchOrders, statusFilter]);

    const handleStatusFilterChange = useCallback((status) => {
        setStatusFilter(status);
    }, []);

    const updateStatus = useCallback(async (orderId, status) => {
        try {
            await orderAPI.updateStatus(orderId, status);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
            if (selectedOrder?._id === orderId) {
                setSelectedOrder(prev => ({ ...prev, status }));
            }
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [selectedOrder]);

    const deleteOrder = useCallback(async (orderId) => {
        try {
            await orderAPI.delete(orderId);
            setOrders(prev => prev.filter(o => o._id !== orderId));
            setPagination(prev => ({ ...prev, total: prev.total - 1 }));
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    const stats = useMemo(() => {
        const all = orders.length;
        const pending = orders.filter(o => o.status === "pending").length;
        const processing = orders.filter(o => o.status === "processing").length;
        const shipped = orders.filter(o => o.status === "shipped").length;
        const delivered = orders.filter(o => o.status === "delivered").length;
        const cancelled = orders.filter(o => o.status === "cancelled").length;
        return { all, pending, processing, shipped, delivered, cancelled };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        if (!searchTerm.trim()) return orders;
        const term = searchTerm.trim().toLowerCase();
        return orders.filter(o =>
            o._id.toLowerCase().includes(term) ||
            o.user?.name?.toLowerCase().includes(term) ||
            o.user?.email?.toLowerCase().includes(term) ||
            o.shippingAddress?.phone?.includes(term)
        );
    }, [orders, searchTerm]);

    const statusCounts = useMemo(() => {
        return { all: pagination.total, ...stats };
    }, [pagination.total, stats]);

    return {
        orders: filteredOrders,
        allOrders: orders,
        loading,
        error,
        pagination,
        fetchOrders,
        updateStatus,
        deleteOrder,
        selectedOrder,
        setSelectedOrder,
        statusFilter,
        handleStatusFilterChange,
        searchTerm,
        setSearchTerm,
        handlePageChange,
        stats,
        statusCounts,
        STATUS_LIST,
    };
};
