import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft, faMapMarkerAlt, faCreditCard, faMoneyBillWave,
    faTruck, faSpinner, faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import { cartAPI } from "./api/cartAPI";
import { getOptimizedImage } from "../../helpers/format";
import Button from "../../components/Button";
import Input from "../../components/Input";

const initialForm = {
    fullName: "",
    phone: "",
    address: "",
    city: "",
};

export default function CheckoutPage() {
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

            const res = await cartAPI.createOrder({
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
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li><Link to="/cart" className="hover:text-amber-600">Giỏ hàng</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Thanh toán</li>
                    </ol>
                </nav>

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Thông tin giao hàng</h2>
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

                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                        <FontAwesomeIcon icon={faCreditCard} className="text-amber-600" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">Phương thức thanh toán</h2>
                                </div>

                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                                        paymentMethod === "cod" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300"
                                    }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={() => setPaymentMethod("cod")}
                                            className="text-amber-600 focus:ring-amber-500"
                                        />
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-600 text-xl" />
                                        <div>
                                            <p className="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</p>
                                            <p className="text-xs text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</p>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                                        paymentMethod === "banking" ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300"
                                    }`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="banking"
                                            checked={paymentMethod === "banking"}
                                            onChange={() => setPaymentMethod("banking")}
                                            className="text-amber-600 focus:ring-amber-500"
                                        />
                                        <FontAwesomeIcon icon={faCreditCard} className="text-blue-600 text-xl" />
                                        <div>
                                            <p className="font-medium text-gray-800">Chuyển khoản ngân hàng</p>
                                            <p className="text-xs text-gray-500">Chuyển khoản qua tài khoản ngân hàng</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú</h2>
                                <textarea
                                    name="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Ghi chú cho đơn hàng (không bắt buộc)..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-500 transition resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-28">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng</h3>

                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex gap-3">
                                            <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
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
                                                <p className="text-xs text-gray-500">x{item.quantity}</p>
                                                <p className="text-sm font-medium text-amber-600">
                                                    {new Intl.NumberFormat("vi-VN").format(item.price * item.quantity)} ₫
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính</span>
                                        <span>{new Intl.NumberFormat("vi-VN").format(subtotal)} ₫</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faTruck} className="text-amber-600 text-xs" />
                                            Phí vận chuyển
                                        </span>
                                        <span className="text-green-600">Miễn phí</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                                        <span>Tổng cộng</span>
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

                                <Link to="/cart" className="block text-center mt-3 text-sm text-gray-500 hover:text-amber-600">
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
