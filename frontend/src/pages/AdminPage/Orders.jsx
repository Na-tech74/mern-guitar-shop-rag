import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye, faCheck, faXmark, faTruck, faSearch, faTrash,
    faBox, faClock, faShippingFast, faCheckDouble, faBan,
    faPhone, faMapMarkerAlt, faCreditCard, faMoneyBillWave,
    faImage, faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { useOrders } from "./hooks/useOrders";
import { formatCurrency, formatDateTime } from "../../helpers/formatters";
import { getStatusColor, getStatusLabel } from "../../helpers/status";
import { useDialog } from "../../components/MessageDialog";
import Button from "../../components/Button";
import Pagination from "../../components/Pagination";

const STATUS_ICONS = {
    pending: faClock,
    processing: faBox,
    shipped: faShippingFast,
    delivered: faCheckDouble,
    cancelled: faBan,
};

const STATUS_STYLES = {
    all: { active: "bg-gray-800 text-white shadow-sm", inactive: "bg-gray-100 text-gray-600 hover:bg-gray-200" },
    pending: { active: "bg-amber-500 text-white shadow-sm", inactive: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
    processing: { active: "bg-blue-500 text-white shadow-sm", inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
    shipped: { active: "bg-purple-500 text-white shadow-sm", inactive: "bg-purple-50 text-purple-700 hover:bg-purple-100" },
    delivered: { active: "bg-emerald-500 text-white shadow-sm", inactive: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
    cancelled: { active: "bg-red-500 text-white shadow-sm", inactive: "bg-red-50 text-red-700 hover:bg-red-100" },
};

export default function Orders() {
    const {
        orders, loading, refetching, error, pagination, confirmUpdateStatus, deleteOrder,
        selectedOrder, setSelectedOrder, statusFilter, handleStatusFilterChange,
        searchTerm, setSearchTerm, handlePageChange, stats, statusCounts, STATUS_LIST
    } = useOrders();
    const { alert } = useDialog();

    const [confirmDelete, setConfirmDelete] = useState(null);

    const handleDelete = async (id) => {
        try {
            await deleteOrder(id);
            setConfirmDelete(null);
        } catch {
            alert({ title: "Lỗi", message: "Xóa đơn hàng thất bại!", variant: "error" });
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await confirmUpdateStatus(id, status);
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Cập nhật thất bại!",
                variant: "error",
            });
        }
    };

    const statCards = [
        { label: "Tất cả", value: statusCounts.all, color: "bg-gray-500", txtColor: "text-gray-700", activeColor: "border-gray-500 bg-gray-50", key: "all", icon: faBox },
        { label: "Chờ xử lý", value: stats.pending, color: "bg-amber-500", txtColor: "text-amber-600", activeColor: "border-amber-500 bg-amber-50", key: "pending", icon: faClock },
        { label: "Đang xử lý", value: stats.processing, color: "bg-blue-500", txtColor: "text-blue-600", activeColor: "border-blue-500 bg-blue-50", key: "processing", icon: faBox },
        { label: "Đang giao", value: stats.shipped, color: "bg-purple-500", txtColor: "text-purple-600", activeColor: "border-purple-500 bg-purple-50", key: "shipped", icon: faShippingFast },
        { label: "Đã giao", value: stats.delivered, color: "bg-emerald-500", txtColor: "text-emerald-600", activeColor: "border-emerald-500 bg-emerald-50", key: "delivered", icon: faCheckDouble },
        { label: "Đã hủy", value: stats.cancelled, color: "bg-red-500", txtColor: "text-red-600", activeColor: "border-red-500 bg-red-50", key: "cancelled", icon: faBan },
    ];

    if (error) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBox} className="text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
                        <p className="text-xs sm:text-sm text-gray-500">Quản lý toàn bộ đơn hàng ({pagination.total})</p>
                    </div>
                </div>
                <div className="rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
                    <p className="mb-4 text-red-500">{error.message || "Không thể tải đơn hàng"}</p>
                    <Button variant="outline" onClick={() => handlePageChange(1)}>Thử lại</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="size-9 sm:size-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <FontAwesomeIcon icon={faBox} className="text-amber-600 text-sm sm:text-lg" />
                </div>
                <div>
                    <h1 className="text-base sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Quản lý đơn hàng</h1>
                    <p className="text-[10px] sm:text-sm text-gray-500">{pagination.total} đơn hàng</p>
                </div>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                {statCards.map((card) => (
                    <button
                        key={card.key}
                        type="button"
                        onClick={() => handleStatusFilterChange(card.key)}
                        className={`rounded-xl p-2.5 sm:p-4 text-center transition border-2 ${
                            statusFilter === card.key
                                ? card.activeColor + " shadow-sm"
                                : "border-transparent bg-white hover:border-gray-200 shadow-sm"
                        }`}
                    >
                        <div className={`size-7 sm:size-8 mx-auto mb-1 sm:mb-2 rounded-full ${card.color} flex items-center justify-center text-white text-[10px] sm:text-sm`}>
                            <FontAwesomeIcon icon={card.icon} />
                        </div>
                        <p className={`text-sm sm:text-lg font-bold ${card.txtColor}`}>{card.value}</p>
                        <p className="text-[9px] sm:text-xs text-gray-500 truncate">{card.label}</p>
                    </button>
                ))}
            </div>

            <div className="rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="relative flex-1 max-w-md w-full">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo mã đơn, tên, email, SĐT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-10 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
                            />
                            {refetching && (
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 animate-spin"
                                />
                            )}
                        </div>
                        <div className="grid grid-cols-3 sm:flex gap-1.5 w-full sm:w-auto">
                            {STATUS_LIST.map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusFilterChange(status)}
                                    className={`px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium transition ${
                                        statusFilter === status ? STATUS_STYLES[status].active : STATUS_STYLES[status].inactive
                                    }`}
                                >
                                    {status === "all" ? "Tất cả" : getStatusLabel(status)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full size-10 sm:size-12 border-b-2 border-amber-400"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 sm:py-16">
                        <div className="size-12 sm:size-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faBox} className="text-xl sm:text-2xl text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-1 text-sm">Không có đơn hàng nào</p>
                        <p className="text-xs sm:text-sm text-gray-400">
                            {statusFilter !== "all"
                                ? `Không có đơn hàng trạng thái "${getStatusLabel(statusFilter)}"`
                                : "Chưa có đơn hàng nào được đặt"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Mã đơn</th>
                                        <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Khách hàng</th>
                                        <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Sản phẩm</th>
                                        <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Tổng tiền</th>
                                        <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Trạng thái</th>
                                        <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Ngày đặt</th>
                                        <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, i) => (
                                        <tr key={order._id} className={`border-b border-gray-50 last:border-0 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                                            <td className="py-3 px-4">
                                                <span className="font-mono text-xs font-medium text-gray-800">
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-gray-800 text-sm">{order.user?.name || "Khách"}</p>
                                                <p className="text-xs text-gray-500">{order.user?.email || ""}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {order.items?.slice(0, 3).map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1">
                                                            {item.image ? (
                                                                <img src={item.image} alt="" className="size-5 rounded object-cover" />
                                                            ) : (
                                                                <FontAwesomeIcon icon={faImage} className="text-gray-400 text-xs" />
                                                            )}
                                                            <span className="text-xs text-gray-600 truncate max-w-[60px]">{item.product}</span>
                                                            <span className="text-xs font-medium text-gray-800">x{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                    {order.items?.length > 3 && (
                                                        <span className="text-xs text-gray-400">+{order.items.length - 3}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-gray-800 text-sm">{formatCurrency(order.total)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    <FontAwesomeIcon icon={STATUS_ICONS[order.status] || faBox} className="text-[10px]" />
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{formatDateTime(order.createdAt)}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => setSelectedOrder(order)} className="size-8 rounded-lg hover:bg-blue-50 text-blue-600 transition-all flex items-center justify-center" title="Xem chi tiết">
                                                        <FontAwesomeIcon icon={faEye} className="text-xs" />
                                                    </button>
                                                    {order.status === "pending" && (
                                                        <>
                                                            <button onClick={() => handleStatusUpdate(order._id, "processing")} className="size-8 rounded-lg hover:bg-blue-50 text-blue-600 transition-all flex items-center justify-center" title="Xác nhận">
                                                                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                                            </button>
                                                            <button onClick={() => handleStatusUpdate(order._id, "cancelled")} className="size-8 rounded-lg hover:bg-red-50 text-red-500 transition-all flex items-center justify-center" title="Hủy">
                                                                <FontAwesomeIcon icon={faXmark} className="text-xs" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {order.status === "processing" && (
                                                        <button onClick={() => handleStatusUpdate(order._id, "shipped")} className="size-8 rounded-lg hover:bg-purple-50 text-purple-600 transition-all flex items-center justify-center" title="Giao hàng">
                                                            <FontAwesomeIcon icon={faTruck} className="text-xs" />
                                                        </button>
                                                    )}
                                                    {order.status === "shipped" && (
                                                        <button onClick={() => handleStatusUpdate(order._id, "delivered")} className="size-8 rounded-lg hover:bg-green-50 text-green-600 transition-all flex items-center justify-center" title="Đã giao">
                                                            <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                                        </button>
                                                    )}
                                                    {(order.status === "cancelled" || order.status === "delivered") && (
                                                        <button onClick={() => setConfirmDelete(order._id)} className="size-8 rounded-lg hover:bg-red-50 text-red-400 transition-all flex items-center justify-center" title="Xóa">
                                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden p-2 space-y-2">
                            {orders.map((order) => (
                                <div key={order._id} className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="p-3">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="font-mono text-[11px] font-semibold text-gray-800 bg-gray-50 px-2 py-0.5 rounded-md">
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(order.status)}`}>
                                                    <FontAwesomeIcon icon={STATUS_ICONS[order.status] || faBox} className="text-[8px]" />
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                            <div className="flex gap-0.5 shrink-0">
                                                <button onClick={() => setSelectedOrder(order)} className="size-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faEye} className="text-[11px]" />
                                                </button>
                                                {(order.status === "cancelled" || order.status === "delivered") && (
                                                    <button onClick={() => setConfirmDelete(order._id)} className="size-7 rounded-lg hover:bg-red-50 text-red-400 flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-semibold">
                                                {(order.user?.name || "K")[0].toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{order.user?.name || "Khách"}</p>
                                                <p className="text-[10px] text-gray-500 truncate">{order.user?.email || ""}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500">
                                                    {order.items?.length || 0} sản phẩm
                                                    {order.items && order.items.length > 0 && (
                                                        <> · {order.items.map(i => i.product).join(", ").length > 40 ? order.items.map(i => i.product).join(", ").slice(0, 40) + "..." : order.items.map(i => i.product).join(", ")}</>
                                                    )}
                                                </p>
                                            </div>
                                            <span className="text-[10px] text-gray-400 shrink-0">{formatDateTime(order.createdAt)}</span>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-gray-50 pt-2 -mx-3 px-3">
                                            <p className="text-sm font-semibold text-gray-800">{formatCurrency(order.total)}</p>
                                            <div className="flex gap-1">
                                                {order.status === "pending" && (
                                                    <>
                                                        <button onClick={() => handleStatusUpdate(order._id, "processing")} className="size-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center" title="Xác nhận">
                                                            <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                                                        </button>
                                                        <button onClick={() => handleStatusUpdate(order._id, "cancelled")} className="size-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center" title="Hủy">
                                                            <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === "processing" && (
                                                    <button onClick={() => handleStatusUpdate(order._id, "shipped")} className="size-7 rounded-lg hover:bg-purple-50 text-purple-600 flex items-center justify-center" title="Giao hàng">
                                                        <FontAwesomeIcon icon={faTruck} className="text-[10px]" />
                                                    </button>
                                                )}
                                                {order.status === "shipped" && (
                                                    <button onClick={() => handleStatusUpdate(order._id, "delivered")} className="size-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center" title="Đã giao">
                                                        <FontAwesomeIcon icon={faCheck} className="text-[10px]" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {pagination.totalPages > 1 && (
                            <div className="border-t border-gray-100 px-3 sm:px-4 py-3">
                                <Pagination
                                    page={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onChange={handlePageChange}
                                    total={pagination.total}
                                    label="đơn hàng"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setSelectedOrder(null)}>
                    <div className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="size-8 sm:size-9 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faBox} className="text-gray-600 text-xs sm:text-sm" />
                                </div>
                                <h2 className="text-sm sm:text-lg font-semibold text-gray-800">
                                    Đơn hàng #{selectedOrder._id.slice(-8).toUpperCase()}
                                </h2>
                            </div>
                            <button type="button" onClick={() => setSelectedOrder(null)} className="size-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors">
                                <span className="text-lg leading-none">&times;</span>
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Tổng tiền</p>
                                    <p className="text-base sm:text-xl font-bold text-gray-800">{formatCurrency(selectedOrder.total)}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Trạng thái</p>
                                    <span className={`inline-flex items-center gap-1 rounded-full px-2 sm:px-3 py-1 text-[11px] sm:text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                        <FontAwesomeIcon icon={STATUS_ICONS[selectedOrder.status] || faBox} className="text-[9px] sm:text-xs" />
                                        {getStatusLabel(selectedOrder.status)}
                                    </span>
                                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-2">
                                        {formatDateTime(selectedOrder.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500 text-xs sm:text-sm" />
                                    <h3 className="font-semibold text-gray-800 text-sm">Thông tin giao hàng</h3>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                                    <p><span className="text-gray-500">Họ tên:</span> <span className="font-medium text-gray-800">{selectedOrder.shippingAddress?.fullName}</span></p>
                                    <p className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-[10px] sm:text-xs" />
                                        <span className="text-gray-500">SĐT:</span>
                                        <span className="font-medium text-gray-800">{selectedOrder.shippingAddress?.phone}</span>
                                    </p>
                                    <p><span className="text-gray-500">Địa chỉ:</span> <span className="text-gray-800">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</span></p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                    <FontAwesomeIcon icon={faCreditCard} className="text-gray-500 text-xs sm:text-sm" />
                                    <h3 className="font-semibold text-gray-800 text-sm">Phương thức thanh toán</h3>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
                                    <FontAwesomeIcon icon={selectedOrder.paymentMethod === "banking" ? faCreditCard : faMoneyBillWave} className="text-base sm:text-xl text-gray-500" />
                                    <span className="font-medium text-gray-800 text-xs sm:text-sm">
                                        {selectedOrder.paymentMethod === "banking" ? "Chuyển khoản ngân hàng" : "Thanh toán khi nhận hàng (COD)"}
                                    </span>
                                </div>
                            </div>

                            {selectedOrder.note && (
                                <div>
                                    <h3 className="font-semibold text-gray-800 text-sm mb-1.5 sm:mb-2">Ghi chú</h3>
                                    <div className="bg-amber-50 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-gray-700">
                                        {selectedOrder.note}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold text-gray-800 text-sm mb-2 sm:mb-3">Sản phẩm ({selectedOrder.items?.length || 0})</h3>
                                <div className="space-y-1.5 sm:space-y-2">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-xl p-2.5 sm:p-3">
                                            <div className="size-10 sm:size-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.product} className="w-full h-full object-cover" loading="lazy" />
                                                ) : (
                                                    <FontAwesomeIcon icon={faImage} className="text-gray-400 text-sm" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{item.product}</p>
                                                <p className="text-[10px] sm:text-xs text-gray-500">
                                                    {formatCurrency(item.price)} x {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-xs sm:text-sm font-semibold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-3 sm:pt-4 flex justify-between items-center">
                                <p className="text-xs sm:text-sm text-gray-600">Tổng cộng</p>
                                <p className="text-base sm:text-xl font-bold text-gray-800">{formatCurrency(selectedOrder.total)}</p>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-4 sm:px-6 py-3 flex justify-end gap-2">
                            <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(null)}>
                                Đóng
                            </Button>
                            {selectedOrder.status === "pending" && (
                                <>
                                    <Button variant="danger" size="sm" onClick={() => { handleStatusUpdate(selectedOrder._id, "cancelled"); setSelectedOrder(null); }}>
                                        <FontAwesomeIcon icon={faXmark} />
                                        Hủy đơn
                                    </Button>
                                    <Button variant="primary" size="sm" onClick={() => { handleStatusUpdate(selectedOrder._id, "processing"); setSelectedOrder(null); }}>
                                        <FontAwesomeIcon icon={faCheck} />
                                        Xác nhận
                                    </Button>
                                </>
                            )}
                            {selectedOrder.status === "processing" && (
                                <Button variant="primary" size="sm" onClick={() => { handleStatusUpdate(selectedOrder._id, "shipped"); setSelectedOrder(null); }}>
                                    <FontAwesomeIcon icon={faTruck} />
                                    Giao hàng
                                </Button>
                            )}
                            {selectedOrder.status === "shipped" && (
                                <Button variant="success" size="sm" onClick={() => { handleStatusUpdate(selectedOrder._id, "delivered"); setSelectedOrder(null); }}>
                                    <FontAwesomeIcon icon={faCheck} />
                                    Đã giao
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
                    <div className="w-full sm:max-w-sm rounded-t-xl sm:rounded-xl bg-white p-4 sm:p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Xóa đơn hàng</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Bạn có chắc muốn xóa đơn hàng này? Hành động này không thể hoàn tác.</p>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                            <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(null)} className="w-full sm:w-auto">Hủy</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(confirmDelete)} className="w-full sm:w-auto">
                                <FontAwesomeIcon icon={faTrash} />
                                Xóa
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
