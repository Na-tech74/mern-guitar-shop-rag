import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMinus, faPlus, faTrash, faShoppingCart, faArrowLeft,
    faShieldAlt, faTruck, faUndo, faTag, faGift
} from "@fortawesome/free-solid-svg-icons";
import { getOptimizedImage } from "../../helpers/format";
import Button from "../../components/Button";

export default function CartPage() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [coupon, setCoupon] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart);
    }, []);

    const dispatchCartUpdate = useCallback(() => {
        window.dispatchEvent(new Event("cart-updated"));
    }, []);

    const updateQuantity = useCallback((id, delta) => {
        setCartItems(prev => {
            const updated = prev.map(item =>
                item._id === id
                    ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
                    : item
            );
            localStorage.setItem("cart", JSON.stringify(updated));
            dispatchCartUpdate();
            return updated;
        });
    }, [dispatchCartUpdate]);

    const removeItem = useCallback((id) => {
        setCartItems(prev => {
            const updated = prev.filter(item => item._id !== id);
            localStorage.setItem("cart", JSON.stringify(updated));
            dispatchCartUpdate();
            return updated;
        });
    }, [dispatchCartUpdate]);

    const clearCart = useCallback(() => {
        localStorage.setItem("cart", "[]");
        setCartItems([]);
        dispatchCartUpdate();
    }, [dispatchCartUpdate]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    const shipping = 0;
    const discount = couponApplied ? subtotal * 0.05 : 0;
    const total = subtotal + shipping - discount;

    const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const handleApplyCoupon = () => {
        if (coupon.trim().toUpperCase() === "GUITAR10") {
            setCouponApplied(true);
        } else {
            setCouponApplied(false);
            alert("Mã giảm giá không hợp lệ!");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Giỏ hàng</li>
                    </ol>
                </nav>

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Giỏ hàng</h1>
                    {cartItems.length > 0 && (
                        <button type="button" onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                            <FontAwesomeIcon icon={faTrash} />
                            Xóa tất cả
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <div className="size-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faShoppingCart} className="text-4xl text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-lg mb-2">Giỏ hàng của bạn đang trống</p>
                        <p className="text-gray-400 text-sm mb-8">Hãy khám phá các sản phẩm của chúng tôi</p>
                        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition font-medium">
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => {
                                const itemTotal = (item.price || 0) * (item.quantity || 1);
                                return (
                                    <div key={item._id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 flex gap-4 sm:gap-5 hover:shadow-sm transition">
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                                            <img
                                                src={getOptimizedImage(item.images?.[0], 200) || "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&q=80"}
                                                alt={item.name}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <Link to={`/products/${item._id}`} className="font-semibold text-gray-800 hover:text-amber-600 line-clamp-2">
                                                        {item.name}
                                                    </Link>
                                                    <button type="button" onClick={() => removeItem(item._id)} className="text-gray-400 hover:text-red-500 p-1 shrink-0 transition">
                                                        <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                                    </button>
                                                </div>
                                                <p className="text-amber-600 font-bold mt-1">
                                                    {new Intl.NumberFormat("vi-VN").format(item.price)} ₫
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button type="button" onClick={() => updateQuantity(item._id, -1)} className="p-2 hover:bg-gray-50 text-gray-500">
                                                        <FontAwesomeIcon icon={faMinus} className="text-xs" />
                                                    </button>
                                                    <span className="px-4 text-sm font-medium min-w-[2rem] text-center">{item.quantity || 1}</span>
                                                    <button type="button" onClick={() => updateQuantity(item._id, 1)} className="p-2 hover:bg-gray-50 text-gray-500">
                                                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {new Intl.NumberFormat("vi-VN").format(itemTotal)} ₫
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={coupon}
                                                onChange={(e) => setCoupon(e.target.value)}
                                                placeholder="Nhập mã giảm giá"
                                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-amber-500 transition"
                                                disabled={couponApplied}
                                            />
                                            <Button
                                                variant={couponApplied ? "success" : "outline"}
                                                size="md"
                                                onClick={handleApplyCoupon}
                                                disabled={couponApplied}
                                            >
                                                {couponApplied ? "Đã áp dụng" : "Áp dụng"}
                                            </Button>
                                        </div>
                                    </div>
                                    <Link to="/products" className="text-sm text-amber-600 hover:text-amber-500 whitespace-nowrap font-medium">
                                        <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                                        Mua thêm
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng giỏ hàng</h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính ({itemCount} sản phẩm)</span>
                                        <span>{new Intl.NumberFormat("vi-VN").format(subtotal)} ₫</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faTruck} className="text-amber-600 text-xs" />
                                            Phí vận chuyển
                                        </span>
                                        <span className="text-green-600 font-medium">Miễn phí</span>
                                    </div>
                                    {couponApplied && (
                                        <div className="flex justify-between text-green-600">
                                            <span className="flex items-center gap-1">
                                                <FontAwesomeIcon icon={faTag} className="text-xs" />
                                                Giảm giá (5%)
                                            </span>
                                            <span>-{new Intl.NumberFormat("vi-VN").format(discount)} ₫</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                                        <span>Tổng cộng</span>
                                        <span className="text-amber-600">{new Intl.NumberFormat("vi-VN").format(total)} ₫</span>
                                    </div>
                                </div>

                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full mt-6"
                                    onClick={() => navigate("/checkout")}
                                >
                                    Tiến hành thanh toán
                                </Button>

                                <div className="mt-4 space-y-2 text-xs text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faShieldAlt} className="text-amber-600" />
                                        Sản phẩm chính hãng 100%
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faUndo} className="text-amber-600" />
                                        Đổi trả trong 7 ngày
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FontAwesomeIcon icon={faGift} className="text-amber-600" />
                                        Quà tặng hấp dẫn
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
