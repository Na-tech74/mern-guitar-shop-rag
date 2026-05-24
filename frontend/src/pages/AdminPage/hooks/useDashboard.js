import { useState, useEffect } from "react";
import { productAPI, categoryAPI, userAPI } from "../api/adminAPI";

export const useDashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalCategories: 0,
        totalOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes, usersRes] = await Promise.all([
                    productAPI.getAll(),
                    categoryAPI.getAll(),
                    userAPI.getAll(),
                ]);
                setStats({
                    totalProducts: productsRes.data?.data?.length || 0,
                    totalUsers: usersRes.data?.length || 0,
                    totalCategories: categoriesRes.data?.data?.length || 0,
                    totalOrders: 0,
                });
            } catch (error) {
                // error
            } finally {
                setLoading(false);
            }
            setRecentOrders([]);
        };
        fetchData();
    }, []);

    const statCards = [
        {
            title: "Tổng sản phẩm",
            value: stats.totalProducts,
            icon: "box",
            color: "bg-blue-500",
            change: "+12%",
            isPositive: true,
        },
        {
            title: "Tổng người dùng",
            value: stats.totalUsers,
            icon: "users",
            color: "bg-green-500",
            change: "+8%",
            isPositive: true,
        },
        {
            title: "Danh mục",
            value: stats.totalCategories,
            icon: "cart",
            color: "bg-purple-500",
            change: "+5%",
            isPositive: true,
        },
        {
            title: "Đơn hàng",
            value: stats.totalOrders,
            icon: "dollar",
            color: "bg-orange-500",
            change: "-3%",
            isPositive: false,
        },
    ];

    return {
        loading,
        statCards,
        recentOrders,
    };
};
