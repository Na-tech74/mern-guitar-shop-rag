import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faFileInvoice, faShoppingBag, faHome } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../../helpers/formatters";
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
        <div className="min-h-dvh bg-gray-50 flex items-center justify-center py-8 sm:py-12">
            <div className="w-full max-w-lg mx-auto px-4 text-center">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-8 sm:p-10 lg:p-12">
                    <div className="size-16 sm:size-20 mx-auto mb-5 sm:mb-6 bg-emerald-50 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-3xl sm:text-4xl text-emerald-500" />
                    </div>

                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        Đặt hàng thành công!
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 mb-1">
                        Cảm ơn bạn đã mua sắm tại Guitar Shop
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8">
                        Mã đơn hàng: <span className="font-mono font-medium text-gray-700">#{state.orderId.slice(-8).toUpperCase()}</span>
                    </p>

                    <div className="border border-gray-200 rounded-xl p-5 sm:p-6 mb-6 sm:mb-8">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Tổng thanh toán</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {formatCurrency(state.total)}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Thanh toán khi nhận hàng (COD)
                        </p>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <Link to="/orders">
                            <Button variant="primary" size="md" className="w-full !bg-emerald-500 hover:!bg-emerald-600">
                                <FontAwesomeIcon icon={faFileInvoice} />
                                Theo dõi đơn hàng
                            </Button>
                        </Link>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/products">
                                <Button variant="secondary" size="md" className="w-full">
                                    <FontAwesomeIcon icon={faShoppingBag} />
                                    Mua thêm
                                </Button>
                            </Link>
                            <Link to="/">
                                <Button variant="secondary" size="md" className="w-full">
                                    <FontAwesomeIcon icon={faHome} />
                                    Trang chủ
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
