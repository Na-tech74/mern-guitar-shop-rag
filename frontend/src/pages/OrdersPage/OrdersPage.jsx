import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faImage, faChevronRight, faChevronDown,
    faBagShopping, faTruck, faCircleCheck, faBan, faClock,
    faLocationDot, faPhone, faUser, faCreditCard, faMoneyBillWave,
    faCalendarDays, faHashtag, faBoxOpen,
    faArrowRight, faXmark, faRotate, faReceipt
} from "@fortawesome/free-solid-svg-icons";
import { orderAPI } from "../../api";
import { getOptimizedImage, getStatusColor, getStatusLabel, formatCurrency, formatDateTime } from "../../helpers/format";

const STATUS_META = {
    pending:     { icon: faClock,           color: "amber"  },
    processing:  { icon: faBoxOpen,         color: "blue"   },
    shipped:     { icon: faTruck,           color: "purple" },
    delivered:   { icon: faCircleCheck,     color: "green"  },
    cancelled:   { icon: faBan,             color: "red"    },
};

const FILTERS = [
    { id: "all",        label: "Tất cả" },
    { id: "pending",    label: "Chờ xử lý" },
    { id: "processing", label: "Đang xử lý" },
    { id: "shipped",    label: "Đang giao" },
    { id: "delivered",  label: "Hoàn thành" },
    { id: "cancelled",  label: "Đã hủy" },
];

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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition shadow-soft w-fit"
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
                                return (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => setActiveFilter(f.id)}
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                                            active
                                                ? "bg-amber-500 text-white shadow-soft"
                                                : "text-gray-600 hover:bg-gray-50"
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

function StatCard({ icon, label, value, accent = "amber", small }) {
    const accents = {
        amber: "bg-amber-50 text-amber-600",
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        rose: "bg-rose-50 text-rose-600",
    };
    return (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-4 hover:shadow-lift transition">
            <div className="flex items-center gap-3">
                <div className={`size-10 rounded-lg ${accents[accent]} flex items-center justify-center shrink-0`}>
                    <FontAwesomeIcon icon={icon} className="text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 truncate">{label}</p>
                    <p className={`font-bold text-gray-900 ${small ? "text-sm" : "text-xl"} truncate`}>
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ hasOrders }) {
    return (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 py-16 px-6 text-center">
            <div className="size-20 rounded-full bg-amber-50 mx-auto flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faBoxOpen} className="text-3xl text-amber-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {hasOrders ? "Không có đơn hàng nào" : "Chưa có đơn hàng"}
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                {hasOrders
                    ? "Thử chọn bộ lọc khác để xem đơn hàng."
                    : "Khám phá các sản phẩm tuyệt vời và đặt đơn đầu tiên của bạn."}
            </p>
            <Link
                to="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition shadow-soft"
            >
                <FontAwesomeIcon icon={faBagShopping} className="text-xs" />
                Mua sắm ngay
            </Link>
        </div>
    );
}

function OrderCard({ order, expanded, onToggle, onViewDetail, formatShortDate }) {
    const meta = STATUS_META[order.status] || STATUS_META.pending;
    const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;
    const firstImage = order.items?.find((i) => i.image)?.image;
    const isCancelled = order.status === "cancelled";

    return (
        <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-lift transition">

            {/* Header */}
            <button
                type="button"
                onClick={onToggle}
                className="w-full p-4 sm:p-5 flex items-center gap-4 text-left"
            >
                {/* Status icon */}
                <div className={`size-11 shrink-0 rounded-lg flex items-center justify-center ${getStatusColor(order.status)}`}>
                    <FontAwesomeIcon icon={meta.icon} className="text-base" />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                            Đơn #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                            <FontAwesomeIcon icon={faCalendarDays} className="text-[10px]" />
                            {formatShortDate(order.createdAt)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <FontAwesomeIcon icon={faBoxOpen} className="text-[10px]" />
                            {itemCount} sản phẩm
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <FontAwesomeIcon icon={faCreditCard} className="text-[10px]" />
                            {order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}
                        </span>
                    </div>
                </div>

                {/* Total */}
                <div className="text-right shrink-0">
                    <p className={`font-bold text-base sm:text-lg ${isCancelled ? "text-gray-400 line-through" : "text-amber-600"}`}>
                        {formatCurrency(order.total)}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">Tổng tiền</p>
                </div>

                {/* Chevron */}
                <FontAwesomeIcon
                    icon={expanded ? faChevronDown : faChevronRight}
                    className="text-gray-300 text-sm shrink-0"
                />
            </button>

            {/* Expanded content */}
            {expanded && (
                <div className="border-t border-gray-100 bg-gray-50/30 p-4 sm:p-5 space-y-4">
                    <OrderItems items={order.items} />

                    <div className="grid sm:grid-cols-2 gap-3">
                        <InfoBlock icon={faLocationDot} title="Địa chỉ giao hàng">
                            <p className="text-sm text-gray-700">{order.shippingAddress?.fullName}</p>
                            <p className="text-sm text-gray-600">{order.shippingAddress?.phone}</p>
                            <p className="text-sm text-gray-600">
                                {order.shippingAddress?.address}, {order.shippingAddress?.city}
                            </p>
                        </InfoBlock>

                        <InfoBlock
                            icon={order.paymentMethod === "cod" ? faMoneyBillWave : faCreditCard}
                            title="Thanh toán"
                        >
                            <p className="text-sm text-gray-700">
                                {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"}
                            </p>
                            {order.note && (
                                <p className="text-xs text-gray-500 mt-1 italic">"{order.note}"</p>
                            )}
                        </InfoBlock>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
                        >
                            <FontAwesomeIcon icon={faPhone} className="text-[10px]" />
                            Liên hệ hỗ trợ
                        </Link>
                        <div className="flex items-center gap-2">
                            {order.status === "delivered" && (
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition"
                                >
                                    <FontAwesomeIcon icon={faRotate} className="text-[10px]" />
                                    Mua lại
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onViewDetail(); }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 transition"
                            >
                                Xem chi tiết
                                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function OrderItems({ items }) {
    if (!items || items.length === 0) return null;
    const max = 3;
    const shown = items.slice(0, max);
    const more = items.length - max;

    return (
        <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Sản phẩm ({items.length})
            </p>
            <div className="space-y-2">
                {shown.map((item, i) => (
                    <div key={item._id || `${item.productId || item.product}-${i}`} className="flex items-center gap-3 bg-white rounded-lg p-2.5">
                        <div className="size-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {item.image ? (
                                <img src={getOptimizedImage(item.image, 100)} alt="" loading="lazy" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <FontAwesomeIcon icon={faImage} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.product}</p>
                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium text-gray-700 shrink-0">
                            {formatCurrency(item.price * item.quantity)}
                        </p>
                    </div>
                ))}
                {more > 0 && (
                    <p className="text-xs text-gray-500 text-center py-1">
                        +{more} sản phẩm khác
                    </p>
                )}
            </div>
        </div>
    );
}

function InfoBlock({ icon, title, children }) {
    return (
        <div className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-1.5">
                <FontAwesomeIcon icon={icon} className="text-xs text-amber-600" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
            </div>
            <div className="space-y-0.5">{children}</div>
        </div>
    );
}

function OrderDetailModal({ order, onClose }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const meta = STATUS_META[order.status] || STATUS_META.pending;
    const subtotal = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
    const shipping = order.total - subtotal;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-t-2xl sm:rounded-2xl shadow-lift w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Chi tiết đơn hàng</h2>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                            <FontAwesomeIcon icon={faHashtag} className="text-[10px]" />
                            {order._id.toUpperCase()}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="size-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-5 space-y-5">
                    {/* Status timeline */}
                    <StatusTimeline status={order.status} />

                    {/* Items */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Sản phẩm</h3>
                        <div className="space-y-2">
                            {order.items?.map((item, i) => (
                                <div key={item._id || `${item.productId || item.product}-${i}`} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                                    <div className="size-14 rounded-lg bg-white overflow-hidden shrink-0 border border-gray-100">
                                        {item.image ? (
                                            <img src={getOptimizedImage(item.image, 150)} alt="" loading="lazy" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FontAwesomeIcon icon={faImage} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.product}</p>
                                        <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                        {item.quantity > 1 && (
                                            <p className="text-xs text-gray-500">{formatCurrency(item.price)} / sp</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info grid */}
                    <div className="grid sm:grid-cols-2 gap-3">
                        <InfoBlock icon={faUser} title="Người nhận">
                            <p className="text-sm text-gray-700">{order.shippingAddress?.fullName}</p>
                            <p className="text-xs text-gray-500 inline-flex items-center gap-1">
                                <FontAwesomeIcon icon={faPhone} className="text-[10px]" />
                                {order.shippingAddress?.phone}
                            </p>
                        </InfoBlock>
                        <InfoBlock icon={faLocationDot} title="Địa chỉ">
                            <p className="text-sm text-gray-700">
                                {order.shippingAddress?.address}, {order.shippingAddress?.city}
                            </p>
                        </InfoBlock>
                        <InfoBlock icon={faCalendarDays} title="Ngày đặt">
                            <p className="text-sm text-gray-700">{formatDateTime(order.createdAt)}</p>
                        </InfoBlock>
                        <InfoBlock
                            icon={order.paymentMethod === "cod" ? faMoneyBillWave : faCreditCard}
                            title="Thanh toán"
                        >
                            <p className="text-sm text-gray-700">
                                {order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}
                            </p>
                        </InfoBlock>
                    </div>

                    {order.note && (
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                            <p className="text-xs font-semibold text-amber-700 mb-1">Ghi chú</p>
                            <p className="text-sm text-gray-700">{order.note}</p>
                        </div>
                    )}

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <SummaryRow label="Tạm tính" value={formatCurrency(subtotal)} />
                        <SummaryRow label="Phí vận chuyển" value={shipping > 0 ? formatCurrency(shipping) : "Miễn phí"} />
                        <div className="pt-2 border-t border-gray-200">
                            <SummaryRow label="Tổng cộng" value={formatCurrency(order.total)} highlight />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-4 flex gap-2">
                    <Link
                        to="/contact"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faPhone} className="text-xs" />
                        Hỗ trợ
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatusTimeline({ status }) {
    const steps = [
        { id: "pending",    label: "Đã đặt",     icon: faCircleCheck },
        { id: "processing", label: "Xử lý",      icon: faBoxOpen     },
        { id: "shipped",    label: "Đang giao",  icon: faTruck       },
        { id: "delivered",  label: "Hoàn thành", icon: faCircleCheck },
    ];
    const order = ["pending", "processing", "shipped", "delivered"];
    const currentIdx = order.indexOf(status);
    const isCancelled = status === "cancelled";

    if (isCancelled) {
        return (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="size-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faBan} className="text-red-600" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-red-700">Đơn hàng đã bị hủy</p>
                    <p className="text-xs text-red-600">Vui lòng liên hệ hỗ trợ nếu cần thêm thông tin</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between gap-1">
                {steps.map((step, i) => {
                    const done = i <= currentIdx;
                    const current = i === currentIdx;
                    return (
                        <div key={step.id} className="flex-1 flex items-center">
                            <div className="flex flex-col items-center gap-1 flex-1">
                                <div className={`size-9 rounded-full flex items-center justify-center transition ${
                                    done
                                        ? current
                                            ? "bg-amber-500 text-white shadow-soft ring-4 ring-amber-100"
                                            : "bg-amber-500 text-white"
                                        : "bg-gray-200 text-gray-400"
                                }`}>
                                    <FontAwesomeIcon icon={step.icon} className="text-xs" />
                                </div>
                                <p className={`text-[10px] sm:text-xs font-medium text-center ${
                                    done ? "text-amber-700" : "text-gray-400"
                                }`}>
                                    {step.label}
                                </p>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`h-0.5 flex-1 -mt-4 sm:-mt-5 ${
                                    i < currentIdx ? "bg-amber-500" : "bg-gray-200"
                                }`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function SummaryRow({ label, value, highlight }) {
    return (
        <div className="flex items-center justify-between">
            <span className={`text-sm ${highlight ? "font-semibold text-gray-900" : "text-gray-600"}`}>
                {label}
            </span>
            <span className={`${highlight ? "text-lg font-bold text-amber-600" : "text-sm text-gray-700"}`}>
                {value}
            </span>
        </div>
    );
}
