import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft, faMapMarkerAlt, faCreditCard, faMoneyBillWave,
    faTruck, faSpinner, faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import { orderAPI } from "../../api";
import { getOptimizedImage } from "../../helpers/image";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useDialog } from "../../components/MessageDialog";

const initialForm = {
    fullName: "",
    phone: "",
    address: "",
    city: "",
};

export default function CheckoutPage() {
    const { alert } = useDialog();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [note, setNote] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login?redirect=/checkout", { replace: true });
            return;
        }

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart.length === 0) {
            navigate("/cart", { replace: true });
            return;
        }
        setCartItems(cart);

        const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
        if (userInfo?.name) {
            setForm(prev => ({ ...prev, fullName: userInfo.name }));
        }
    }, [navigate]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const total = subtotal;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
        if (!form.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
        else if (!/^(0|\+84)[3-9][0-9]{8}$/.test(form.phone.trim())) {
            newErrors.phone = "Số điện thoại không hợp lệ";
        }
        if (!form.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
        if (!form.city.trim()) newErrors.city = "Vui lòng nhập thành phố";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const items = cartItems.map(item => ({
                product: item.name,
                productId: item._id,
                quantity: item.quantity,
            }));

            const res = await orderAPI.create({
                items,
                shippingAddress: {
                    fullName: form.fullName.trim(),
                    phone: form.phone.trim(),
                    address: form.address.trim(),
                    city: form.city.trim(),
                },
                paymentMethod,
                note: note.trim(),
            });

            localStorage.setItem("cart", "[]");
            window.dispatchEvent(new Event("cart-updated"));

            const orderData = res.data?.data?.order || {};
            navigate("/order-success", {
                state: {
                    orderId: orderData._id,
                    total: orderData.total || total,
                }
            });
        } catch (err) {
            const msg = err.response?.data?.message || "Đặt hàng thất bại, vui lòng thử lại!";
            await alert({ title: "Lỗi", message: msg, variant: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-400">
                        <li><Link to="/" className="hover:text-amber-500 transition">Trang chủ</Link></li>
                        <li className="text-gray-300">/</li>
                        <li><Link to="/cart" className="hover:text-amber-500 transition">Giỏ hàng</Link></li>
                        <li className="text-gray-300">/</li>
                        <li className="text-gray-600 font-medium">Thanh toán</li>
                    </ol>
                </nav>

                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thanh toán</h1>
                    <div className="w-12 h-1 bg-amber-400 rounded-full mt-2" />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber-500" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-800">Thông tin giao hàng</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faCreditCard} className="text-amber-500" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-800">Phương thức thanh toán</h2>
                                </div>

                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                                        paymentMethod === "cod" ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300"
                                    }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={() => setPaymentMethod("cod")}
                                            className="text-amber-500 focus:ring-amber-400/30"
                                        />
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-amber-500 text-xl" />
                                        <div>
                                            <p className="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</p>
                                            <p className="text-xs text-gray-400">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                                        paymentMethod === "banking" ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300"
                                    }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="banking"
                                            checked={paymentMethod === "banking"}
                                            onChange={() => setPaymentMethod("banking")}
                                            className="text-amber-500 focus:ring-amber-400/30"
                                        />
                                        <FontAwesomeIcon icon={faCreditCard} className="text-amber-500 text-xl" />
                                        <div>
                                            <p className="font-medium text-gray-800">Chuyển khoản ngân hàng</p>
                                            <p className="text-xs text-gray-400">Chuyển khoản qua tài khoản ngân hàng</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Ghi chú</h2>
                                <textarea
                                    name="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Ghi chú cho đơn hàng (không bắt buộc)..."
                                    rows={3}
                                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition resize-none placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft sticky top-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Đơn hàng</h3>

                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex gap-3 p-2 rounded-xl hover:bg-gray-50 transition">
                                            <div className="size-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                                <img
                                                    src={getOptimizedImage(item.images?.[0], 100) || ""}
                                                    alt={item.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-400">x{item.quantity}</p>
                                                <p className="text-sm font-semibold text-amber-600">
                                                    {new Intl.NumberFormat("vi-VN").format(item.price * item.quantity)} ₫
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Tạm tính</span>
                                        <span className="font-medium text-gray-700">{new Intl.NumberFormat("vi-VN").format(subtotal)} ₫</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faTruck} className="text-amber-400 text-xs" />
                                            Phí vận chuyển
                                        </span>
                                        <span className="text-emerald-600 font-medium">Miễn phí</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-lg">
                                        <span className="text-gray-800">Tổng cộng</span>
                                        <span className="text-amber-600">{new Intl.NumberFormat("vi-VN").format(total)} ₫</span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
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
