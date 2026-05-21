import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash, faShoppingCart, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart);
    }, []);

    const updateQuantity = (index, delta) => {
        const updated = [...cartItems];
        updated[index].quantity = Math.max(1, (updated[index].quantity || 1) + delta);
        setCartItems(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };

    const removeItem = (index) => {
        const updated = cartItems.filter((_, i) => i !== index);
        setCartItems(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };

    const total = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Giỏ hàng</li>
                    </ol>
                </nav>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-6xl text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg mb-6">Giỏ hàng của bạn đang trống</p>
                        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition">
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4">
                                    <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                        <img src={item.images?.[0] || "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=200&q=80"} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/products/${item._id}`} className="font-semibold text-gray-800 hover:text-amber-600">{item.name}</Link>
                                        <p className="text-amber-600 font-bold mt-1">{new Intl.NumberFormat("vi-VN").format(item.price)} ₫</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button onClick={() => updateQuantity(index, -1)} className="p-2 hover:bg-gray-50"><FontAwesomeIcon icon={faMinus} className="text-xs" /></button>
                                                <span className="px-3 text-sm font-medium">{item.quantity || 1}</span>
                                                <button onClick={() => updateQuantity(index, 1)} className="p-2 hover:bg-gray-50"><FontAwesomeIcon icon={faPlus} className="text-xs" /></button>
                                            </div>
                                            <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-fit">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng giỏ hàng</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>{new Intl.NumberFormat("vi-VN").format(total)} ₫</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                                    <span>Tổng cộng</span>
                                    <span className="text-amber-600">{new Intl.NumberFormat("vi-VN").format(total)} ₫</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition">
                                Tiến hành thanh toán
                            </button>
                            <Link to="/products" className="block text-center mt-3 text-sm text-gray-500 hover:text-amber-600">
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
