import { useState, useCallback, useEffect } from "react";
import { orderAPI } from "../../api/adminAPI";

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const refetch = useCallback(async () => {
        try {
            setLoading(true);
            const res = await orderAPI.getAll();
            setOrders(res.data?.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const updateStatus = useCallback(async (orderId, status) => {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    }, []);

    return {
        orders,
        loading,
        error,
        refetch,
        updateStatus,
    };
};