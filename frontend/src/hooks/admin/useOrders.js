import { useState, useCallback, useEffect } from "react";
import { orderAPI } from "../../api/adminAPI";

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const fetchOrders = useCallback(async (page = 1, status = "") => {
        try {
            setLoading(true);
            const res = await orderAPI.getAll({ page, limit: 10, status });
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
        fetchOrders();
    }, [fetchOrders]);

    const updateStatus = useCallback(async (orderId, status) => {
        try {
            await orderAPI.updateStatus(orderId, status);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    const deleteOrder = useCallback(async (orderId) => {
        try {
            await orderAPI.delete(orderId);
            setOrders(prev => prev.filter(o => o._id !== orderId));
        } catch (err) {
            setError(err);
            throw err;
        }
    }, []);

    return {
        orders,
        loading,
        error,
        pagination,
        fetchOrders,
        updateStatus,
        deleteOrder,
    };
};