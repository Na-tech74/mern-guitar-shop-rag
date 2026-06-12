import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle, faFileInvoice, faShoppingBag, faHome,
    faBuilding, faCopy, faCircleInfo
} from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../../helpers/formatters";
import Button from "../../components/Button";
import Breadcrumb from "../../components/Breadcrumb";
import useOrderSuccessPage from "./hooks/useOrderSuccessPage";

const BANK_INFO = {
    bank: "TP Bank",
    shortName: "TPB",
    branch: "Chi nhánh TP. Hồ Chí Minh",
    accountNumber: "00000026120",
    accountName: "CÔNG TY TNHH GUITAR SHOP",
};

export default function OrderSuccessPage() {
    const { state } = useOrderSuccessPage();
    const [copied, setCopied] = useState(false);

    if (!state?.orderId) return null;

    const orderCode = `DH${state.orderId.slice(-8).toUpperCase()}`;

    const qrUrl = useMemo(() => {
        const base = `https://img.vietqr.io/image/${BANK_INFO.shortName}-${BANK_INFO.accountNumber}-compact2.png`;
        const params = new URLSearchParams({
            amount: Math.round(state.total),
            addInfo: orderCode,
            accountName: BANK_INFO.accountName,
        });
        return `${base}?${params}`;
    }, [state.total, orderCode]);

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { }
    };

    return (
        <div className="min-h-dvh bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng", href: "/cart" }, { label: "Đặt hàng thành công" }]} />
            </div>
            <div className="flex items-center justify-center py-8 sm:py-12">
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
                        Mã đơn hàng: <span className="font-mono font-medium text-gray-700">#{orderCode}</span>
                    </p>

                    <div className="border border-gray-200 rounded-xl p-5 sm:p-6 mb-6 sm:mb-8">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Tổng thanh toán</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {formatCurrency(state.total)}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            {state.paymentMethod === "momo" ? "Thanh toán qua ví MoMo" : state.paymentMethod === "banking" ? "Chuyển khoản ngân hàng" : "Thanh toán khi nhận hàng (COD)"}
                        </p>
                    </div>

                    {state.paymentMethod === "banking" && (
                        <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-5 sm:p-6 mb-6 text-left">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faBuilding} className="text-blue-600 text-sm" />
                                </div>
                                <h3 className="font-semibold text-gray-800 text-sm">Thông tin chuyển khoản</h3>
                            </div>

                            <div className="flex justify-center mb-4">
                                <img
                                    src={qrUrl}
                                    alt="QR chuyển khoản"
                                    className="size-44 rounded-xl border border-blue-200 bg-white"
                                    loading="lazy"
                                />
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Ngân hàng</span>
                                    <span className="font-medium text-gray-800">{BANK_INFO.bank}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Chi nhánh</span>
                                    <span className="font-medium text-gray-800">{BANK_INFO.branch}</span>
                                </div>
                                <div className="border-t border-blue-100" />
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-500">Số tài khoản</span>
                                        <button type="button" onClick={() => handleCopy(BANK_INFO.accountNumber)} className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1">
                                            <FontAwesomeIcon icon={faCopy} />
                                            {copied ? "Đã copy" : "Sao chép"}
                                        </button>
                                    </div>
                                    <p className="font-bold text-gray-900 text-base tracking-wider">{BANK_INFO.accountNumber}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Chủ tài khoản</span>
                                    <p className="font-medium text-gray-800">{BANK_INFO.accountName}</p>
                                </div>
                                <div className="border-t border-blue-100" />
                                <div>
                                    <span className="text-gray-500">Số tiền chuyển</span>
                                    <p className="font-bold text-gray-900 text-base">{formatCurrency(state.total)}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">Nội dung chuyển khoản</span>
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono font-medium text-gray-800 text-sm bg-gray-100 px-2 py-1 rounded">{orderCode}</p>
                                        <button type="button" onClick={() => handleCopy(orderCode)} className="text-blue-600 hover:text-blue-700 text-xs">
                                            <FontAwesomeIcon icon={faCopy} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-start gap-2 bg-gray-50 border rounded-lg p-3 text-xs ">
                                <FontAwesomeIcon icon={faCircleInfo} className="mt-0.5 shrink-0" />
                                <p>Đơn hàng sẽ được xử lý sau khi chúng tôi nhận được tiền chuyển khoản. Vui lòng giữ lại biên lai để đối chiếu.</p>
                            </div>
                        </div>
                    )}

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
        </div>
    );
}
