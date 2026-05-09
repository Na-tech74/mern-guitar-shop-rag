import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useOrders } from "../../hooks/admin";

export default function Orders() {
    const { orders, loading, updateStatus } = useOrders();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-700";
            case "completed": return "bg-green-100 text-green-700";
            case "processing": return "bg-blue-100 text-blue-700";
            case "cancelled": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "pending": return "Chờ xử lý";
            case "completed": return "Hoàn thành";
            case "processing": return "Đang xử lý";
            case "cancelled": return "Đã hủy";
            default: return status;
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
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
                <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
                <p className="text-gray-500">Quản lý danh sách đơn hàng</p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Mã đơn</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Khách hàng</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Sản phẩm</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Tổng tiền</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Trạng thái</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Ngày đặt</th>
                                <th className="pb-3 text-right text-xs font-medium uppercase text-gray-500">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b border-gray-100 last:border-0">
                                    <td className="py-3 font-medium text-gray-800">#{order._id}</td>
                                    <td className="py-3">
                                        <p className="font-medium text-gray-800">{order.user?.name || "Khách hàng"}</p>
                                        <p className="text-xs text-gray-500">{order.user?.email || ""}</p>
                                    </td>
                                    <td className="py-3 text-sm text-gray-600">
                                        {order.items?.map((item, idx) => (
                                            <div key={idx}>{item.product} x{item.quantity}</div>
                                        ))}
                                    </td>
                                    <td className="py-3 font-medium text-gray-800">{formatCurrency(order.total)}</td>
                                    <td className="py-3">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="py-3 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                                                title="Xem chi tiết"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                            {order.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(order._id, "processing")}
                                                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                                        title="Xác nhận"
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(order._id, "cancelled")}
                                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                                        title="Hủy"
                                                    >
                                                        <FontAwesomeIcon icon={faXmark} />
                                                    </button>
                                                </>
                                            )}
                                            {order.status === "processing" && (
                                                <button
                                                    onClick={() => updateStatus(order._id, "completed")}
                                                    className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                                                    title="Hoàn thành"
                                                >
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">Chi tiết đơn hàng #{selectedOrder._id}</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Khách hàng</p>
                                <p className="font-medium text-gray-800">{selectedOrder.user?.name || "Khách hàng"}</p>
                                <p className="text-sm text-gray-600">{selectedOrder.user?.email || ""}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Sản phẩm</p>
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between py-2">
                                        <span className="text-gray-800">{item.product} x{item.quantity}</span>
                                        <span className="font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Tổng cộng</span>
                                    <span className="text-lg font-bold text-gray-800">{formatCurrency(selectedOrder.total)}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Trạng thái</p>
                                <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                    {getStatusLabel(selectedOrder.status)}
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}