import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers, faBox, faCartShopping, faDollarSign,
    faClock, faShippingFast, faCheckDouble, faBan, faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { getStatusColor, getStatusLabel, formatCurrency, formatDateTime } from "../../../helpers/format";
import { useDashboard } from "../hooks/useDashboard";
import Button from "../../../components/Button";
import { Link } from "react-router-dom";

const iconMap = {
    box: faBox,
    users: faUsers,
    cart: faCartShopping,
    dollar: faDollarSign,
};

const statusConfig = [
    { key: "pending", label: "Chờ xử lý", icon: faClock, color: "bg-yellow-500" },
    { key: "processing", label: "Đang xử lý", icon: faBox, color: "bg-blue-500" },
    { key: "shipped", label: "Đang giao", icon: faShippingFast, color: "bg-purple-500" },
    { key: "delivered", label: "Đã giao", icon: faCheckDouble, color: "bg-green-500" },
    { key: "cancelled", label: "Đã hủy", icon: faBan, color: "bg-red-500" },
];

export default function Dashboard() {
    const { loading, error, statCards, recentOrders, orderStats, totalOrders, totalRevenue } = useDashboard();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full size-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h1>
                <div className="rounded-xl bg-white p-8 text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>Thử lại</Button>
                </div>
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
                                <FontAwesomeIcon icon={iconMap[stat.icon]} className="text-xl" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                            <p className="text-sm text-gray-500">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {statusConfig.map((cfg) => (
                    <Link key={cfg.key} to={`/admin/orders`}
                        className="rounded-xl bg-white p-5 shadow-sm hover:shadow-md transition border border-gray-100"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg ${cfg.color} flex items-center justify-center text-white`}>
                                <FontAwesomeIcon icon={cfg.icon} />
                            </div>
                            <span className="text-xs text-gray-400">{cfg.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{orderStats[cfg.key] || 0}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {totalOrders > 0 ? `${Math.round(((orderStats[cfg.key] || 0) / totalOrders) * 100)}% tổng đơn` : "Chưa có đơn"}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h3>
                        {recentOrders.length > 0 && (
                            <Link to="/admin/orders" className="text-sm text-amber-600 hover:text-amber-500 flex items-center gap-1">
                                Xem tất cả <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        )}
                    </div>
                    {recentOrders.length === 0 ? (
                        <p className="text-center py-8 text-gray-400 text-sm">Chưa có đơn hàng nào</p>
                    ) : (
                        <div className="overflow-x-auto">
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
                                <tbody>
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
                    )}
                </div>

                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan doanh thu</h3>
                    <div className="flex items-end justify-around gap-2 h-64">
                        {recentOrders.length > 0 ? (
                            (() => {
                                const days = {};
                                recentOrders.forEach(o => {
                                    const d = new Date(o.createdAt).toLocaleDateString("vi-VN", { weekday: "narrow" });
                                    days[d] = (days[d] || 0) + o.total;
                                });
                                const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
                                const values = dayNames.map(d => days[d] || 0);
                                const max = Math.max(...values, 1);
                                return dayNames.map((day, i) => (
                                    <div key={i} className="flex flex-col items-center flex-1">
                                        <p className="text-xs text-gray-400 mb-1">
                                            {values[i] > 0 ? formatCurrency(values[i]).replace("₫", "").trim() : ""}
                                        </p>
                                        <div
                                            className="w-full max-w-[32px] rounded-t-md bg-gradient-to-t from-amber-600 to-amber-400 transition-all hover:from-amber-700 hover:to-amber-500"
                                            style={{ height: `${(values[i] / max) * 100}%`, minHeight: values[i] > 0 ? "4px" : "0" }}
                                        ></div>
                                        <span className="mt-2 text-xs text-gray-500">{day}</span>
                                    </div>
                                ));
                            })()
                        ) : (
                            <div className="w-full flex items-center justify-center text-gray-400 text-sm">
                                Chưa có dữ liệu doanh thu
                            </div>
                        )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Tổng doanh thu (đã giao)</span>
                        <span className="text-xl font-bold text-amber-600">{formatCurrency(totalRevenue)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
