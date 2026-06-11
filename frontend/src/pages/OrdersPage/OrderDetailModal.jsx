import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faImage, faTruck, faCircleCheck, faBan, faBoxOpen, faClock,
    faLocationDot, faPhone, faUser, faCreditCard, faMoneyBillWave,
    faCalendarDays, faHashtag, faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, formatDateTime } from "../../helpers/formatters";
import { getOptimizedImage } from "../../helpers/image";
import InfoBlock from "./InfoBlock";

const STATUS_META = {
    pending:     { icon: faClock,           color: "amber"  },
    processing:  { icon: faBoxOpen,         color: "blue"   },
    shipped:     { icon: faTruck,           color: "purple" },
    delivered:   { icon: faCircleCheck,     color: "green"  },
    cancelled:   { icon: faBan,             color: "red"    },
};

function StatusTimeline({ status }) {
    const colors = {
        pending:    { bg: "bg-amber-500",  ring: "ring-amber-100", text: "text-amber-700" },
        processing: { bg: "bg-blue-500",   ring: "ring-blue-100",  text: "text-blue-700"  },
        shipped:    { bg: "bg-purple-500", ring: "ring-purple-100",text: "text-purple-700" },
        delivered:  { bg: "bg-green-500",  ring: "ring-green-100", text: "text-green-700" },
    };
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
            <div className="relative">
                {/* Connector line */}
                <div className="absolute top-[18px] left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 z-0" />
                {/* Circles */}
                <div className="grid grid-cols-4 relative z-10">
                    {steps.map((step, i) => {
                        const done = i <= currentIdx;
                        const current = i === currentIdx;
                        const c = colors[step.id];
                        return (
                            <div key={step.id} className="flex justify-center">
                                <div className={`size-9 rounded-full flex items-center justify-center transition ${
                                    done
                                        ? current
                                            ? `${c.bg} text-white shadow-soft ring-4 ${c.ring}`
                                            : `${c.bg} text-white`
                                        : "bg-gray-200 text-gray-400"
                                }`}>
                                    <FontAwesomeIcon icon={step.icon} className="text-xs" />
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Labels */}
                <div className="grid grid-cols-4 mt-1.5 relative z-10">
                    {steps.map((step, i) => {
                        const done = i <= currentIdx;
                        const c = colors[step.id];
                        return (
                            <div key={step.id} className="text-center">
                                <p className={`text-[10px] sm:text-xs font-medium leading-tight ${done ? c.text : "text-gray-400"}`}>
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
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

export default function OrderDetailModal({ order, onClose }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const meta = STATUS_META[order.status] || STATUS_META.pending;
    const subtotal = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
    const shipping = order.total - subtotal;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Chi tiết đơn hàng</h2>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                            <FontAwesomeIcon icon={faHashtag} className="text-[10px]" />
                            {order._id.toUpperCase()}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="size-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"
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
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Sản phẩm ({order.items?.length || 0})</h3>
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
                        <div className="rounded-lg p-3">
                            <p className="text-xs font-semibold mb-1">Ghi chú</p>
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
                        className="flex-1 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
