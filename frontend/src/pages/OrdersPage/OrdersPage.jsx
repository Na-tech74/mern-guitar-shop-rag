import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice, faImage } from "@fortawesome/free-solid-svg-icons";
import { orderAPI } from "../AdminPage/api/adminAPI";
import { getOptimizedImage, getStatusColor, getStatusLabel, formatCurrency, formatDate } from "../../helpers/format";

export default function OrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li><Link to="/account" className="hover:text-amber-600">Tài khoản</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Đơn hàng</li>
                    </ol>
                </nav>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Đơn hàng của tôi</h1>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                        <FontAwesomeIcon icon={faFileInvoice} className="text-6xl text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg mb-6">Bạn chưa có đơn hàng nào</p>
                        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition">
                            Mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-sm transition">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Mã đơn: <span className="font-medium text-gray-800">#{order._id.slice(-8).toUpperCase()}</span>
                                        </p>
                                        <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {order.items?.map((item, i) => (
                                        <div key={item._id || `${item.productId || item.product}-${i}`} className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                {item.image ? (
                                                    <img src={getOptimizedImage(item.image, 100)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
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
                                            <p className="text-sm font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                    <Link to={`/contact`} className="text-xs text-amber-600 hover:text-amber-500 font-medium">
                                        Liên hệ hỗ trợ
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Tổng:</span>
                                        <span className="font-bold text-amber-600">{formatCurrency(order.total)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
