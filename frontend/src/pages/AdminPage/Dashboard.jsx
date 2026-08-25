import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers, faBox, faCartShopping, faDollarSign, faArrowRight,
    faComments, faCalendarDay, faCalendarWeek, faCalendarAlt, faFire
} from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, formatDateTime } from "../../helpers/formatters";
import { getStatusColor, getStatusLabel } from "../../helpers/status";
import { useDashboard } from "./hooks/useDashboard";
import { chatbotAPI } from "../../api";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import RevenueChart from "./components/RevenueChart";
import TopSellingProducts from "./components/TopSellingProducts";
import TopSellingCategories from "./components/TopSellingCategories";

const topicColorMap = {
    "giá cả": "bg-green-100 text-green-700",
    "guitar": "bg-blue-100 text-blue-700",
    "giao hàng": "bg-yellow-100 text-yellow-700",
    "bảo hành": "bg-red-100 text-red-700",
    "đổi trả": "bg-orange-100 text-orange-700",
    "thanh toán": "bg-purple-100 text-purple-700",
    "hướng dẫn": "bg-indigo-100 text-indigo-700",
    "so sánh sản phẩm": "bg-pink-100 text-pink-700",
    "phụ kiện": "bg-teal-100 text-teal-700",
    "khác": "bg-gray-100 text-gray-600",
};

export default function Dashboard() {
    const { loading, error, statCards, recentOrders, totalRevenue } = useDashboard();
    const [chatStats, setChatStats] = useState(null);
    const [chatLoading, setChatLoading] = useState(true);
    const iconMap = { box: faBox, users: faUsers, cart: faCartShopping, dollar: faDollarSign };

    useEffect(() => {
        chatbotAPI.getStats()
            .then(res => setChatStats(res.data?.data))
            .catch(() => {})
            .finally(() => setChatLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full size-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
                <div className="rounded-xl bg-white p-8 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>Thử lại</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
                <p className="text-xs sm:text-sm text-gray-500">Chào mừng bạn đến với trang quản trị</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <div key={index} className="rounded-xl bg-white p-3 sm:p-6 shadow-sm">
                        <div className={`flex size-8 sm:size-12 items-center justify-center rounded-lg sm:rounded-xl ${stat.color} text-white`}>
                            <FontAwesomeIcon icon={iconMap[stat.icon]} className="text-xs sm:text-xl" />
                        </div>
                        <div className="mt-2 sm:mt-4">
                            <h3 className="text-sm sm:text-2xl font-bold text-gray-800">{stat.value}</h3>
                            <p className="text-[10px] sm:text-sm text-gray-500 truncate">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue Chart */}
            <RevenueChart />

            {/* Top Selling */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <TopSellingProducts />
                <TopSellingCategories />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Đơn hàng gần đây</h3>
                        {recentOrders.length > 0 && (
                            <Link to="/admin/orders" className="text-xs sm:text-sm text-gray-700 hover:text-amber-500 flex items-center gap-1">
                                Xem tất cả <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        )}
                    </div>
                    {recentOrders.length === 0 ? (
                        <p className="text-center py-8 text-gray-400 text-sm">Chưa có đơn hàng nào</p>
                    ) : (
                        <>
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Mã đơn</th>
                                            <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Khách hàng</th>
                                            <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Tổng tiền</th>
                                            <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Trạng thái</th>
                                            <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Ngày</th>
                                        </tr>
                                    </thead>
                                    <tbody className="whitespace-nowrap">
                                        {recentOrders.map((order) => (
                                            <tr key={order._id} className="border-b border-gray-100 last:border-0">
                                                <td className="py-3">
                                                    <span className="font-mono text-xs font-medium text-gray-800">
                                                        #{order._id.slice(-8).toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-sm text-gray-800">{order.user?.name || "Khách"}</td>
                                                <td className="py-3 text-sm font-medium text-gray-800">{formatCurrency(order.total)}</td>
                                                <td className="py-3">
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {getStatusLabel(order.status)}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-sm text-gray-500">{formatDateTime(order.createdAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="md:hidden space-y-2">
                                {recentOrders.map((order) => (
                                    <div key={order._id} className="rounded-lg border border-gray-100 p-3 text-xs">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="font-mono font-medium text-gray-800">#{order._id.slice(-8).toUpperCase()}</span>
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-gray-500">
                                            <span>{order.user?.name || "Khách"}</span>
                                            <span className="font-medium text-gray-800">{formatCurrency(order.total)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="rounded-xl bg-white p-4 sm:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Thống kê Chatbot</h3>
                        <Link to="/admin/chat-test" className="text-xs sm:text-sm text-gray-700 hover:text-amber-500 flex items-center gap-1">
                            Test Chat <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                    </div>
                    {chatLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full size-8 border-b-2 border-amber-500"></div>
                        </div>
                    ) : chatStats ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-blue-50 p-3 text-center">
                                    <FontAwesomeIcon icon={faComments} className="text-blue-500 text-lg mb-1" />
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{chatStats.total}</p>
                                    <p className="text-[10px] sm:text-xs text-gray-500">Tổng câu hỏi</p>
                                </div>
                                <div className="rounded-lg bg-green-50 p-3 text-center">
                                    <FontAwesomeIcon icon={faCalendarDay} className="text-green-500 text-lg mb-1" />
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{chatStats.todayCount}</p>
                                    <p className="text-[10px] sm:text-xs text-gray-500">Hôm nay</p>
                                </div>
                                <div className="rounded-lg bg-yellow-50 p-3 text-center">
                                    <FontAwesomeIcon icon={faCalendarWeek} className="text-yellow-500 text-lg mb-1" />
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{chatStats.weekCount}</p>
                                    <p className="text-[10px] sm:text-xs text-gray-500">7 ngày qua</p>
                                </div>
                                <div className="rounded-lg bg-purple-50 p-3 text-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-500 text-lg mb-1" />
                                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{chatStats.monthCount}</p>
                                    <p className="text-[10px] sm:text-xs text-gray-500">Tháng này</p>
                                </div>
                            </div>

                            {chatStats.topicStats.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <FontAwesomeIcon icon={faFire} className="text-orange-500 text-sm" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">Chủ đề tư vấn phổ biến</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {chatStats.topicStats.map((t, i) => (
                                            <span
                                                key={i}
                                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium ${topicColorMap[t.topic] || topicColorMap["khác"]}`}
                                            >
                                                {t.topic} ({t.count})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400 text-sm">
                            Chưa có dữ liệu chatbot
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
