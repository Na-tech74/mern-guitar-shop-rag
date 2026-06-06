import { useState, useEffect } from "react";
import { orderAPI } from "../../../api";

export const useDashboard = () => {
    const [data, setData] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalRevenue: 0,
        orderStats: {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        },
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await orderAPI.getStats();
                const stats = res.data?.data;
                if (stats) {
                    setData({
                        totalProducts: stats.totalProducts || 0,
                        totalUsers: stats.totalUsers || 0,
                        totalCategories: stats.totalCategories || 0,
                        totalOrders: stats.totalOrders || 0,
                        totalRevenue: stats.totalRevenue || 0,
                        orderStats: stats.orderStats || {},
                        recentOrders: stats.recentOrders || []
                    });
                }
            } catch (err) {
                setError(err.response?.data?.message || "Không thể tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        {
            title: "Tổng sản phẩm",
            value: data.totalProducts,
            icon: "box",
            color: "bg-blue-500",
        },
        {
            title: "Người dùng",
            value: data.totalUsers,
            icon: "users",
            color: "bg-green-500",
        },
        {
            title: "Danh mục",
            value: data.totalCategories,
            icon: "cart",
            color: "bg-purple-500",
        },
        {
            title: "Đơn hàng",
            value: data.totalOrders,
            icon: "dollar",
            color: "bg-orange-500",
        },
    ];

    return {
        loading,
        error,
        statCards,
        recentOrders: data.recentOrders,
        orderStats: data.orderStats,
        totalOrders: data.totalOrders,
        totalRevenue: data.totalRevenue,
    };
};
