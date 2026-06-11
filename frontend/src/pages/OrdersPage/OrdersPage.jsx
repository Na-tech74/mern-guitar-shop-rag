import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBagShopping, faTruck, faCircleCheck,
    faCreditCard, faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { orderAPI } from "../../api";
import { formatCurrency, formatDateTime } from "../../helpers/formatters";
import StatCard from "./StatCard";
import EmptyState from "./EmptyState";
import OrderCard from "./OrderCard";
import OrderDetailModal from "./OrderDetailModal";

const FILTERS = [
    { id: "all",        label: "Tất cả" },
    { id: "pending",    label: "Chờ xử lý" },
    { id: "processing", label: "Đang xử lý" },
    { id: "shipped",    label: "Đang giao" },
    { id: "delivered",  label: "Hoàn thành" },
    { id: "cancelled",  label: "Đã hủy" },
];

const COLOR_MAP = {
    all:        { active: "bg-gray-800 text-white shadow-soft",            inactive: "bg-gray-100 text-gray-600 hover:bg-gray-200" },
    pending:    { active: "bg-amber-500 text-white shadow-soft",           inactive: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
    processing: { active: "bg-blue-500 text-white shadow-soft",            inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
    shipped:    { active: "bg-purple-500 text-white shadow-soft",          inactive: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
    delivered:  { active: "bg-emerald-500 text-white shadow-soft",         inactive: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
    cancelled:  { active: "bg-red-500 text-white shadow-soft",             inactive: "bg-red-50 text-red-700 hover:bg-red-100" },
};

export default function OrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [expandedId, setExpandedId] = useState(null);
    const [detailOrder, setDetailOrder] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }
        orderAPI.getMyOrders()
            .then((res) => setOrders(res.data?.data?.orders || []))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, [navigate]);

    const stats = useMemo(() => ({
        total: orders.length,
        active: orders.filter((o) => ["pending", "processing", "shipped"].includes(o.status)).length,
        done: orders.filter((o) => o.status === "delivered").length,
        spent: orders
            .filter((o) => o.status === "delivered")
            .reduce((s, o) => s + (o.total || 0), 0),
    }), [orders]);

    const counts = useMemo(() => {
        const c = { all: orders.length };
        for (const o of orders) c[o.status] = (c[o.status] || 0) + 1;
        return c;
    }, [orders]);

    const filtered = useMemo(() => {
        if (activeFilter === "all") return orders;
        return orders.filter((o) => o.status === activeFilter);
    }, [orders, activeFilter]);

    const formatShortDate = (d) => formatDateTime(d);

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Breadcrumb */}
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600 transition">Trang chủ</Link></li>
                        <li className="text-gray-300">/</li>
                        <li><Link to="/account" className="hover:text-amber-600 transition">Tài khoản</Link></li>
                        <li className="text-gray-300">/</li>
                        <li className="text-gray-800 font-medium">Đơn hàng</li>
                    </ol>
                </nav>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Đơn hàng của tôi</h1>
                        <p className="text-sm text-gray-500 mt-1">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
                    </div>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold transition shadow-soft w-fit"
                    >
                        <FontAwesomeIcon icon={faBagShopping} className="text-xs" />
                        Tiếp tục mua sắm
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <StatCard icon={faReceipt} label="Tổng đơn" value={stats.total} accent="amber" />
                    <StatCard icon={faTruck} label="Đang xử lý" value={stats.active} accent="blue" />
                    <StatCard icon={faCircleCheck} label="Hoàn thành" value={stats.done} accent="green" />
                    <StatCard icon={faCreditCard} label="Đã chi" value={formatCurrency(stats.spent)} accent="rose" small />
                </div>

                {/* Filters */}
                {!loading && orders.length > 0 && (
                    <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-2 mb-4 overflow-x-auto">
                        <div className="flex gap-1 min-w-max">
                            {FILTERS.map((f) => {
                                const count = counts[f.id] || 0;
                                const active = activeFilter === f.id;
                                const c = COLOR_MAP[f.id] || COLOR_MAP.all;
                                return (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => setActiveFilter(f.id)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                                            active ? c.active : c.inactive
                                        }`}
                                    >
                                        {f.label}
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                            active ? "bg-white/20" : "bg-gray-100 text-gray-500"
                                        }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Order List */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                                <div className="flex justify-between mb-4">
                                    <div className="h-4 w-32 bg-gray-200 rounded" />
                                    <div className="h-6 w-20 bg-gray-200 rounded-full" />
                                </div>
                                <div className="flex gap-3">
                                    <div className="size-12 bg-gray-200 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState hasOrders={orders.length > 0} />
                ) : (
                    <div className="space-y-3">
                        {filtered.map((order) => (
                            <OrderCard
                                key={order._id}
                                order={order}
                                expanded={expandedId === order._id}
                                onToggle={() => setExpandedId(expandedId === order._id ? null : order._id)}
                                onViewDetail={() => setDetailOrder(order)}
                                formatShortDate={formatShortDate}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {detailOrder && (
                <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />
            )}
        </div>
    );
}
