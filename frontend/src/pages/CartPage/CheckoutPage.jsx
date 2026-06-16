import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft, faMapMarkerAlt, faCreditCard, faMoneyBillWave,
    faCheckCircle, faWallet
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Textarea from "../../components/Textarea";
import useCheckoutPage from "./hooks/useCheckoutPage";
import OrderSummaryContent from "./components/OrderSummaryContent";

export default function CheckoutPage() {
    const {
        cartItems,
        form, errors, handleChange,
        paymentMethod, setPaymentMethod, getPaymentBorderClass,
        note, setNote,
        submitting,
        subtotal, itemCount, total,
        handleSubmit,
    } = useCheckoutPage();

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Breadcrumb */}
                <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Giỏ hàng", href: "/cart" }, { label: "Thanh toán" }]} />

                {/* Tiêu đề trang */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thanh toán</h1>
                    <div className="w-12 h-1 bg-amber-400 rounded-full mt-2" />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-5 sm:space-y-6">

                            {/* Đơn hàng (mobile) */}
                            <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-soft">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Đơn hàng</h3>
                                <OrderSummaryContent cartItems={cartItems} subtotal={subtotal} itemCount={itemCount} total={total} />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    className="w-full mt-6"
                                    loading={submitting}
                                >
                                    {submitting ? (
                                        <>Đang xử lý...</>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                            Đặt hàng
                                        </>
                                    )}
                                </Button>
                                <Link to="/cart" className="block text-center mt-3 text-sm text-gray-400 hover:text-amber-500 transition font-medium">
                                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                                    Quay lại giỏ hàng
                                </Link>
                            </div>

                            {/* Thông tin giao hàng */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-soft">
                                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                    <div className="size-9 sm:size-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber-500 text-sm sm:text-base" />
                                    </div>
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">Thông tin giao hàng</h2>
                                </div>

                                {/* Form nhập họ tên, sđt, địa chỉ, thành phố */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <Input
                                        label="Họ và tên"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="Nguyễn Văn A"
                                        required
                                        error={errors.fullName}
                                    />
                                    <Input
                                        label="Số điện thoại"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="0378623181"
                                        required
                                        error={errors.phone}
                                    />
                                    <div className="sm:col-span-2">
                                        <Input
                                            label="Địa chỉ"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            placeholder="Số nhà, tên đường, phường/xã"
                                            required
                                            error={errors.address}
                                        />
                                    </div>
                                    <Input
                                        label="Thành phố"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="Hồ Chí Minh"
                                        required
                                        error={errors.city}
                                    />
                                </div>
                            </div>
                       
                            {/* Phương thức thanh toán */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-soft">

                                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                                    <div className="size-9 sm:size-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faCreditCard} className="text-amber-500 text-sm sm:text-base" />
                                    </div>
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">Phương thức thanh toán</h2>
                                </div>

                                <div className="space-y-3">
                                    {/* COD */}
                                    <label className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition ${getPaymentBorderClass("cod")}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={() => setPaymentMethod("cod")}
                                            className="text-emerald-500 focus:ring-emerald-400/30 shrink-0"
                                        />
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-emerald-500 text-lg sm:text-xl shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 text-sm sm:text-base">Thanh toán khi nhận hàng (COD)</p>
                                            <p className="text-xs text-gray-400">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                        </div>
                                    </label>

                                    {/* Chuyển khoản ngân hàng */}
                                    <label className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition ${getPaymentBorderClass("banking")}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="banking"
                                            checked={paymentMethod === "banking"}
                                            onChange={() => setPaymentMethod("banking")}
                                            className="text-blue-500 focus:ring-blue-400/30 shrink-0"
                                        />
                                        <FontAwesomeIcon icon={faCreditCard} className="text-blue-500 text-lg sm:text-xl shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 text-sm sm:text-base">Chuyển khoản ngân hàng</p>
                                            <p className="text-xs text-gray-400">Chuyển khoản qua tài khoản ngân hàng</p>
                                        </div>
                                    </label>

                                      {/* MoMo */}
                                      <label className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition ${getPaymentBorderClass("momo")}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="momo"
                                            checked={paymentMethod === "momo"}
                                            onChange={() => setPaymentMethod("momo")}
                                            className="text-rose-500 focus:ring-rose-400/30 shrink-0"
                                        />
                                        <FontAwesomeIcon icon={faWallet} className="text-rose-500 text-lg sm:text-xl shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 text-sm sm:text-base">Ví MoMo</p>
                                            <p className="text-xs text-gray-400">Thanh toán qua ví MoMo</p>
                                        </div>
                                    </label>
                                    
                                </div>
                            </div>
                         
                            {/* Ghi chú đơn hàng */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-soft">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Ghi chú</h2>
                                <Textarea
                                    name="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Ghi chú cho đơn hàng (không bắt buộc)..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* Sidebar: Đơn hàng (desktop) */}
                        <div className="hidden lg:block space-y-4">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft sticky top-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Đơn hàng</h3>
                                <OrderSummaryContent cartItems={cartItems} subtotal={subtotal} itemCount={itemCount} total={total} />
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    className="w-full mt-6"
                                    loading={submitting}
                                >
                                    {submitting ? (
                                        <>Đang xử lý...</>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                            Đặt hàng
                                        </>
                                    )}
                                </Button>
                                <Link to="/cart" className="block text-center mt-3 text-sm text-gray-400 hover:text-amber-500 transition font-medium">
                                    <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                                    Quay lại giỏ hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
