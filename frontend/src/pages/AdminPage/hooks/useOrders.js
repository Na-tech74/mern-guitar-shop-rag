import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { orderAPI } from "../../../api";
import useDebounce from "../../../hooks/useDebounce";
import { useDialog } from "../../../components/MessageDialog";

const STATUS_LIST = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

export const useOrders = () => {
    const { confirm } = useDialog();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 300);

    const hasLoadedRef = useRef(false);

    const fetchOrders = useCallback(async (page = 1, status = "", { silent = false } = {}) => {
        try {
            if (silent && hasLoadedRef.current) {
                setRefetching(true);
            } else {
                setLoading(true);
            }
            setError(null);
            const params = { page, limit: 10 };
            if (status) params.status = status;
            const res = await orderAPI.getAll(params);
            const data = res.data?.data;
            setOrders(data?.orders || []);
            setPagination({
                page: data?.page || 1,
                totalPages: data?.totalPages || 1,
                total: data?.total || 0
            });
            hasLoadedRef.current = true;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
            setRefetching(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders(1, statusFilter === "all" ? "" : statusFilter);
    }, [fetchOrders, statusFilter]);

    // Refetch khi tab visible lại — silent, không flash bảng.
    // Dùng ref để tránh re-attach listener mỗi lần đổi trang.
    const lastFetchRef = useRef({ page: 1, status: "" });
    useEffect(() => {
        lastFetchRef.current = {
            page: pagination.page,
            status: statusFilter === "all" ? "" : statusFilter,
        };
    }, [pagination.page, statusFilter]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && hasLoadedRef.current) {
                fetchOrders(lastFetchRef.current.page, lastFetchRef.current.status, { silent: true });
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [fetchOrders]);

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

    /**
     * Hỏi xác nhận trước khi đổi trạng thái đơn hàng.
     * Trả về true nếu user đồng ý và update thành công.
     */
    const confirmUpdateStatus = useCallback(async (orderId, status) => {
        const labels = {
            cancelled: "hủy",
            processing: "xác nhận",
            shipped: "chuyển sang giao hàng",
            delivered: "xác nhận đã giao",
        };
        const ok = await confirm({
            title: "Xác nhận thao tác",
            message: `Bạn có chắc muốn ${labels[status] || status} đơn hàng này?`,
            variant: status === "cancelled" ? "danger" : "warning",
        });
        if (!ok) return false;
        await updateStatus(orderId, status);
        return true;
    }, [confirm, updateStatus]);

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
        if (!debouncedSearch.trim()) return orders;
        const term = debouncedSearch.trim().toLowerCase();
        return orders.filter(o =>
            o._id.toLowerCase().includes(term) ||
            o.user?.name?.toLowerCase().includes(term) ||
            o.user?.email?.toLowerCase().includes(term) ||
            o.shippingAddress?.phone?.includes(term)
        );
    }, [orders, debouncedSearch]);

    const statusCounts = useMemo(() => {
        return { all: pagination.total, ...stats };
    }, [pagination.total, stats]);

    return {
        orders: filteredOrders,
        allOrders: orders,
        loading,
        refetching,
        error,
        pagination,
        fetchOrders,
        updateStatus,
        confirmUpdateStatus,
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
