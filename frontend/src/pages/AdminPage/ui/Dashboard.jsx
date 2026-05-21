import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers,
    faBox,
    faCartShopping,
    faDollarSign,
    faArrowUp,
    faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { productAPI, categoryAPI, userAPI } from "../api/adminAPI";

const fetchDashboardData = async (setStats, setRecentOrders, setLoading) => {
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

    setRecentOrders([
        // { id: "1", customer: "Nguyễn Văn A", total: 2500000, status: "pending", date: "2024-01-15" },
        // { id: "2", customer: "Trần Thị B", total: 1800000, status: "completed", date: "2024-01-14" },
        // { id: "3", customer: "Lê Văn C", total: 3200000, status: "processing", date: "2024-01-13" },
        // { id: "4", customer: "Phạm Thị D", total: 1500000, status: "completed", date: "2024-01-12" },
        // { id: "5", customer: "Hoàng Văn E", total: 4500000, status: "pending", date: "2024-01-11" },
    ]);
};

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalCategories: 0,
        totalOrders: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData(setStats, setRecentOrders, setLoading);
    }, []);

    const statCards = [
        {
            title: "Tổng sản phẩm",
            value: stats.totalProducts,
            icon: faBox,
            color: "bg-blue-500",
            change: "+12%",
            isPositive: true,
        },
        {
            title: "Tổng người dùng",
            value: stats.totalUsers,
            icon: faUsers,
            color: "bg-green-500",
            change: "+8%",
            isPositive: true,
        },
        {
            title: "Danh mục",
            value: stats.totalCategories,
            icon: faCartShopping,
            color: "bg-purple-500",
            change: "+5%",
            isPositive: true,
        },
        {
            title: "Đơn hàng",
            value: stats.totalOrders,
            icon: faDollarSign,
            color: "bg-orange-500",
            change: "-3%",
            isPositive: false,
        },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-700";
            case "completed": return "bg-green-100 text-green-700";
            case "processing": return "bg-blue-100 text-blue-700";
            case "cancelled": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
                <p className="text-gray-500">Chào mừng bạn đến với trang quản trị</p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <div key={index} className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-white`}>
                                <FontAwesomeIcon icon={stat.icon} className="text-xl" />
                            </div>
                            <div className={`flex items-center gap-1 text-sm ${stat.isPositive ? "text-green-500" : "text-red-500"}`}>
                                <FontAwesomeIcon icon={stat.isPositive ? faArrowUp : faArrowDown} />
                                <span>{stat.change}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                            <p className="text-sm text-gray-500">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Đơn hàng gần đây</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Khách hàng</th>
                                    <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Tổng tiền</th>
                                    <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Trạng thái</th>
                                    <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Ngày</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-gray-100 last:border-0">
                                        <td className="py-3 text-sm text-gray-800">{order.customer}</td>
                                        <td className="py-3 text-sm font-medium text-gray-800">{formatCurrency(order.total)}</td>
                                        <td className="py-3">
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status === "pending" ? "Chờ xử lý" :
                                                 order.status === "completed" ? "Hoàn thành" :
                                                 order.status === "processing" ? "Đang xử lý" : "Đã hủy"}
                                            </span>
                                        </td>
                                        <td className="py-3 text-sm text-gray-500">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Thống kê doanh thu</h3>
                    <div className="flex h-64 items-end justify-around gap-2">
                        {[65, 45, 80, 55, 90, 70, 85].map((height, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div
                                    className="w-8 rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 transition-all hover:from-amber-700 hover:to-amber-500"
                                    style={{ height: `${height}%` }}
                                ></div>
                                <span className="mt-2 text-xs text-gray-500">
                                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][index]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}