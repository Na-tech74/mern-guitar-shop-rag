import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faImage, faChevronRight, faChevronDown,
    faPhone, faCreditCard, faMoneyBillWave,
    faCalendarDays, faBoxOpen, faTruck, faCircleCheck, faBan, faClock,
    faArrowRight, faRotate, faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, formatDateTime } from "../../helpers/formatters";
import { getStatusLabel } from "../../helpers/status";
import { getOptimizedImage } from "../../helpers/image";
import InfoBlock from "./InfoBlock";
import Button from "../../components/Button";

const STATUS_META = {
    pending:     { icon: faClock,       iconBg: "bg-amber-100 text-amber-600" },
    processing:  { icon: faBoxOpen,     iconBg: "bg-sky-100 text-sky-600"   },
    shipped:     { icon: faTruck,       iconBg: "bg-violet-100 text-violet-600" },
    delivered:   { icon: faCircleCheck, iconBg: "bg-emerald-100 text-emerald-600" },
    cancelled:   { icon: faBan,         iconBg: "bg-red-100 text-red-600" },
};

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

export default function OrderCard({ order, expanded, onToggle, onViewDetail, formatShortDate }) {
    const meta = STATUS_META[order.status] || STATUS_META.pending;
    const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;
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
                <div className={`size-11 shrink-0 rounded-lg flex items-center justify-center ${meta.iconBg}`}>
                    <FontAwesomeIcon icon={meta.icon} className="text-base" />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="font-semibold text-gray-900 text-sm sm:text-base">
                            Đơn #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            order.status === "pending" ? "bg-amber-100 text-amber-700" :
                            order.status === "processing" ? "bg-sky-100 text-sky-700" :
                            order.status === "shipped" ? "bg-violet-100 text-violet-700" :
                            order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                            "bg-red-100 text-red-700"
                        }`}>
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
                            {order.paymentMethod === "cod" ? "COD" : order.paymentMethod === "momo" ? "Ví MoMo" : "Chuyển khoản"}
                        </span>
                    </div>
                </div>

                {/* Total */}
                <div className="text-right shrink-0">
                    <p className={`font-bold text-base sm:text-lg ${isCancelled ? "text-gray-400 line-through" : "text-gray-900"}`}>
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
                                {order.paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" : order.paymentMethod === "momo" ? "Ví MoMo" : "Chuyển khoản ngân hàng"}
                            </p>
                            {order.paymentMethod !== "cod" && (
                                <span className={`inline-block mt-1 text-xs font-medium ${
                                    order.paymentStatus === "paid" ? "text-emerald-600" : "text-red-500"
                                }`}>
                                    {order.paymentStatus === "paid" ? "✓ Đã thanh toán" : "⏳ Chưa thanh toán"}
                                </span>
                            )}
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
                            <Button size="sm" variant="primary" onClick={(e) => { e.stopPropagation(); onViewDetail(); }}>
                                Xem chi tiết
                                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                            </Button>
                            {order.status === "delivered" && (
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition"
                                >
                                    <FontAwesomeIcon icon={faRotate} className="text-[10px]" />
                                    Mua lại
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
