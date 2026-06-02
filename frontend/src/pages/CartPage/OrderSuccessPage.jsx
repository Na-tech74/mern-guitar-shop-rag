import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faFileInvoice, faShoppingBag, faHome } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";

export default function OrderSuccessPage() {
    const { state } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!state?.orderId) {
            navigate("/", { replace: true });
        }
    }, [state, navigate]);

    if (!state?.orderId) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
            <div className="max-w-lg mx-auto px-4 text-center">
                <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 shadow-sm">
                    <div className="size-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-green-500" />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Đặt hàng thành công!
                    </h1>
                    <p className="text-gray-500 mb-2">
                        Cảm ơn bạn đã mua sắm tại Guitar Shop
                    </p>
                    <p className="text-sm text-gray-400 mb-8">
                        Mã đơn hàng: <span className="font-mono font-medium text-gray-700">#{state.orderId.slice(-8).toUpperCase()}</span>
                    </p>

                    <div className="bg-amber-50 rounded-xl p-4 mb-8">
                        <p className="text-sm text-gray-600 mb-1">Tổng thanh toán</p>
                        <p className="text-2xl font-bold text-amber-600">
                            {new Intl.NumberFormat("vi-VN").format(state.total)} ₫
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Thanh toán khi nhận hàng (COD)
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Link to="/orders">
                            <Button variant="primary" size="lg" className="w-full">
                                <FontAwesomeIcon icon={faFileInvoice} />
                                Theo dõi đơn hàng
                            </Button>
                        </Link>
                        <Link to="/products">
                            <Button variant="outline" size="lg" className="w-full">
                                <FontAwesomeIcon icon={faShoppingBag} />
                                Tiếp tục mua sắm
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button variant="ghost" size="md" className="w-full">
                                <FontAwesomeIcon icon={faHome} />
                                Về trang chủ
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
