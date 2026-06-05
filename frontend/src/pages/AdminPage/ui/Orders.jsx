import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEye, faCheck, faXmark, faTruck, faSearch, faTrash,
    faBox, faClock, faShippingFast, faCheckDouble, faBan,
    faPhone, faMapMarkerAlt, faCreditCard, faMoneyBillWave,
    faImage, faTimes, faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { useOrders } from "../hooks/useOrders";
import { getStatusColor, getStatusLabel, formatCurrency, formatDateTime } from "../../../helpers/format";
import { useDialog } from "../../../components/ConfirmDialog";
import Button from "../../../components/Button";
import Pagination from "../../../components/Pagination";

const STATUS_ICONS = {
    pending: faClock,
    processing: faBox,
    shipped: faShippingFast,
    delivered: faCheckDouble,
    cancelled: faBan,
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
        { label: "Tất cả", value: statusCounts.all, color: "bg-gray-500", key: "all", icon: faBox },
        { label: "Chờ xử lý", value: stats.pending, color: "bg-yellow-500", key: "pending", icon: faClock },
        { label: "Đang xử lý", value: stats.processing, color: "bg-blue-500", key: "processing", icon: faBox },
        { label: "Đang giao", value: stats.shipped, color: "bg-purple-500", key: "shipped", icon: faShippingFast },
        { label: "Đã giao", value: stats.delivered, color: "bg-green-500", key: "delivered", icon: faCheckDouble },
        { label: "Đã hủy", value: stats.cancelled, color: "bg-red-500", key: "cancelled", icon: faBan },
    ];

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
                <div className="rounded-xl bg-white p-8 text-center">
                    <p className="text-red-500 mb-4">{error.message || "Không thể tải đơn hàng"}</p>
                    <Button variant="outline" onClick={() => handlePageChange(1)}>
                        Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
                <p className="text-gray-500">Quản lý toàn bộ đơn hàng ({pagination.total})</p>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                {statCards.map((card) => (
                    <button
                        key={card.key}
                        type="button"
                        onClick={() => handleStatusFilterChange(card.key)}
                        className={`rounded-xl p-4 text-center transition border-2 ${
                            statusFilter === card.key
                                ? "border-amber-500 bg-amber-50 shadow-sm"
                                : "border-transparent bg-white hover:border-gray-200 shadow-sm"
                        }`}
                    >
                        <div className={`w-8 h-8 mx-auto mb-2 rounded-full ${card.color} flex items-center justify-center text-white text-sm`}>
                            <FontAwesomeIcon icon={card.icon} />
                        </div>
                        <p className="text-lg font-bold text-gray-800">{card.value}</p>
                        <p className="text-xs text-gray-500">{card.label}</p>
                    </button>
                ))}
            </div>

            <div className="rounded-xl bg-white shadow-sm">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="relative flex-1 max-w-md">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm theo mã đơn, tên, email, SĐT..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-10 text-sm outline-none focus:border-amber-500"
                            />
                            {refetching && (
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 animate-spin"
                                    aria-label="Đang tải lại"
                                />
                            )}
                        </div>
                        <div className="flex gap-2">
                            {STATUS_LIST.map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleStatusFilterChange(status)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                        statusFilter === status
                                            ? "bg-amber-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                        <div className="animate-spin rounded-full size-12 border-b-2 border-amber-600"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="size-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faBox} className="text-2xl text-gray-400" />
                        </div>
                        <p className="text-gray-500 mb-1">Không có đơn hàng nào</p>
                        <p className="text-sm text-gray-400">
                            {statusFilter !== "all"
                                ? `Không có đơn hàng trạng thái "${getStatusLabel(statusFilter)}"`
                                : "Chưa có đơn hàng nào được đặt"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        <th className="py-3 px-4 text-left text-xs font-medium uppercase text-gray-500">Mã đơn</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium uppercase text-gray-500">Khách hàng</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium uppercase text-gray-500">Sản phẩm</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium uppercase text-gray-500">Tổng tiền</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium uppercase text-gray-500">Trạng thái</th>
                                        <th className="py-3 px-4 text-left text-xs font-medium uppercase text-gray-500">Ngày đặt</th>
                                        <th className="py-3 px-4 text-right text-xs font-medium uppercase text-gray-500">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
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
                                                            <span className="text-xs text-gray-600">{item.product?.slice(0, 15)}...</span>
                                                            <span className="text-xs font-medium text-gray-800">x{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                    {order.items?.length > 3 && (
                                                        <span className="text-xs text-gray-400">+{order.items.length - 3}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 font-medium text-gray-800 text-sm">{formatCurrency(order.total)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    <FontAwesomeIcon icon={STATUS_ICONS[order.status] || faBox} className="text-[10px]" />
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{formatDateTime(order.createdAt)}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                                        <FontAwesomeIcon icon={faEye} className="text-gray-500" />
                                                    </Button>
                                                    {order.status === "pending" && (
                                                        <>
                                                            <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(order._id, "processing")}>
                                                                <FontAwesomeIcon icon={faCheck} className="text-blue-600" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(order._id, "cancelled")}>
                                                                <FontAwesomeIcon icon={faXmark} className="text-red-600" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    {order.status === "processing" && (
                                                        <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(order._id, "shipped")}>
                                                            <FontAwesomeIcon icon={faTruck} className="text-purple-600" />
                                                        </Button>
                                                    )}
                                                    {order.status === "shipped" && (
                                                        <Button variant="ghost" size="sm" onClick={() => handleStatusUpdate(order._id, "delivered")}>
                                                            <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                                                        </Button>
                                                    )}
                                                    {(order.status === "cancelled" || order.status === "delivered") && (
                                                        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(order._id)}>
                                                            <FontAwesomeIcon icon={faTrash} className="text-red-400" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {pagination.totalPages > 1 && (
                            <Pagination
                                page={pagination.page}
                                totalPages={pagination.totalPages}
                                onChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedOrder(null)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedOrder(null); } }} role="button" tabIndex={0}>
                    <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Chi tiết đơn hàng #{selectedOrder._id.slice(-8).toUpperCase()}
                            </h2>
                            <button type="button" onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-amber-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Tổng tiền</p>
                                    <p className="text-xl font-bold text-amber-600">{formatCurrency(selectedOrder.total)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                        <FontAwesomeIcon icon={STATUS_ICONS[selectedOrder.status] || faBox} />
                                        {getStatusLabel(selectedOrder.status)}
                                    </span>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Đặt lúc: {formatDateTime(selectedOrder.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber-600" />
                                    <h3 className="font-semibold text-gray-800">Thông tin giao hàng</h3>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                                    <p><span className="text-gray-500">Họ tên:</span> <span className="font-medium text-gray-800">{selectedOrder.shippingAddress?.fullName}</span></p>
                                    <p className="flex items-center gap-1">
                                        <FontAwesomeIcon icon={faPhone} className="text-gray-400 text-xs" />
                                        <span className="text-gray-500">SĐT:</span>
                                        <span className="font-medium text-gray-800">{selectedOrder.shippingAddress?.phone}</span>
                                    </p>
                                    <p><span className="text-gray-500">Địa chỉ:</span> <span className="text-gray-800">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</span></p>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FontAwesomeIcon icon={faCreditCard} className="text-amber-600" />
                                    <h3 className="font-semibold text-gray-800">Phương thức thanh toán</h3>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                                    <FontAwesomeIcon icon={selectedOrder.paymentMethod === "banking" ? faCreditCard : faMoneyBillWave} className="text-xl text-gray-500" />
                                    <span className="font-medium text-gray-800">
                                        {selectedOrder.paymentMethod === "banking" ? "Chuyển khoản ngân hàng" : "Thanh toán khi nhận hàng (COD)"}
                                    </span>
                                </div>
                            </div>

                            {selectedOrder.note && (
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Ghi chú</h3>
                                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
                                        {selectedOrder.note}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Sản phẩm ({selectedOrder.items?.length || 0})</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                            <div className="size-12 rounded-lg bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.product} className="w-full h-full object-cover" loading="lazy" />
                                                ) : (
                                                    <FontAwesomeIcon icon={faImage} className="text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{item.product}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatCurrency(item.price)} x {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center">
                                <p className="text-gray-600">Tổng cộng</p>
                                <p className="text-xl font-bold text-amber-600">{formatCurrency(selectedOrder.total)}</p>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-3 flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                                Đóng
                            </Button>
                            {selectedOrder.status === "pending" && (
                                <>
                                    <Button variant="danger" onClick={() => { handleStatusUpdate(selectedOrder._id, "cancelled"); setSelectedOrder(null); }}>
                                        <FontAwesomeIcon icon={faXmark} />
                                        Hủy đơn
                                    </Button>
                                    <Button variant="primary" onClick={() => { handleStatusUpdate(selectedOrder._id, "processing"); setSelectedOrder(null); }}>
                                        <FontAwesomeIcon icon={faCheck} />
                                        Xác nhận
                                    </Button>
                                </>
                            )}
                            {selectedOrder.status === "processing" && (
                                <Button variant="primary" onClick={() => { handleStatusUpdate(selectedOrder._id, "shipped"); setSelectedOrder(null); }}>
                                    <FontAwesomeIcon icon={faTruck} />
                                    Giao hàng
                                </Button>
                            )}
                            {selectedOrder.status === "shipped" && (
                                <Button variant="success" onClick={() => { handleStatusUpdate(selectedOrder._id, "delivered"); setSelectedOrder(null); }}>
                                    <FontAwesomeIcon icon={faCheck} />
                                    Đã giao
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirmDelete(null)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setConfirmDelete(null); } }} role="button" tabIndex={0}>
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Xóa đơn hàng</h3>
                        <p className="text-sm text-gray-500 mb-6">Bạn có chắc muốn xóa đơn hàng này? Hành động này không thể hoàn tác.</p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Hủy</Button>
                            <Button variant="danger" onClick={() => handleDelete(confirmDelete)}>
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
