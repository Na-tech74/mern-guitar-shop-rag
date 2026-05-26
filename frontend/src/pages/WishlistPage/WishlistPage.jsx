import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHeart, faShoppingCart, faTrash, faImage,
    faCheckCircle, faArrowLeft, faHeartBroken, faShoppingBag
} from "@fortawesome/free-solid-svg-icons";
import { getOptimizedImage } from "../../helpers/format";
import Button from "../../components/Button";

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [addedIds, setAddedIds] = useState(new Set());

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlist(stored);
    }, []);

    const dispatchUpdate = useCallback(() => {
        window.dispatchEvent(new Event("wishlist-updated"));
    }, []);

    const removeFromWishlist = useCallback((id) => {
        setWishlist(prev => {
            const updated = prev.filter(item => item._id !== id);
            localStorage.setItem("wishlist", JSON.stringify(updated));
            dispatchUpdate();
            return updated;
        });
    }, [dispatchUpdate]);

    const clearAll = useCallback(() => {
        if (!window.confirm("Xóa tất cả sản phẩm yêu thích?")) return;
        localStorage.setItem("wishlist", "[]");
        setWishlist([]);
        dispatchUpdate();
    }, [dispatchUpdate]);

    const addToCart = useCallback((item) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existing = cart.find(c => c._id === item._id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                _id: item._id,
                name: item.name,
                price: item.price,
                images: item.images,
                quantity: 1,
            });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cart-updated"));
        setAddedIds(prev => new Set(prev).add(item._id));
        setTimeout(() => {
            setAddedIds(prev => {
                const next = new Set(prev);
                next.delete(item._id);
                return next;
            });
        }, 1500);
    }, []);

    const addAllToCart = useCallback(() => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        wishlist.forEach(item => {
            const existing = cart.find(c => c._id === item._id);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    images: item.images,
                    quantity: 1,
                });
            }
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cart-updated"));
        const allIds = new Set(wishlist.map(item => item._id));
        setAddedIds(allIds);
        setTimeout(() => setAddedIds(new Set()), 1500);
    }, [wishlist]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Yêu thích</li>
                    </ol>
                </nav>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sản phẩm yêu thích</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {wishlist.length > 0
                                ? `Có ${wishlist.length} sản phẩm`
                                : "Danh sách yêu thích trống"}
                        </p>
                    </div>
                    {wishlist.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={addAllToCart}>
                                <FontAwesomeIcon icon={faShoppingBag} />
                                Thêm tất cả vào giỏ
                            </Button>
                            <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 px-3 py-2">
                                <FontAwesomeIcon icon={faTrash} />
                                Xóa tất cả
                            </button>
                        </div>
                    )}
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <div className="w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeartBroken} className="text-4xl text-red-300" />
                        </div>
                        <p className="text-gray-500 text-lg mb-2">Chưa có sản phẩm yêu thích</p>
                        <p className="text-gray-400 text-sm mb-8">Hãy khám phá và thêm sản phẩm bạn yêu thích</p>
                        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition font-medium">
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {wishlist.map((item) => {
                            const isAdded = addedIds.has(item._id);
                            return (
                                <div key={item._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300">
                                    <Link to={`/products/${item._id}`} className="block h-48 sm:h-52 bg-gray-100 overflow-hidden relative">
                                        {item.images?.[0] ? (
                                            <img src={getOptimizedImage(item.images[0], 400)} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FontAwesomeIcon icon={faImage} className="text-3xl" />
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => { e.preventDefault(); removeFromWishlist(item._id); }}
                                            className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow-sm"
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                        </button>
                                    </Link>
                                    <div className="p-3 sm:p-4">
                                        <Link to={`/products/${item._id}`} className="font-semibold text-gray-800 line-clamp-2 hover:text-amber-600 text-sm sm:text-base">
                                            {item.name}
                                        </Link>
                                        <p className="text-amber-600 font-bold mt-1.5 text-sm sm:text-base">
                                            {new Intl.NumberFormat("vi-VN").format(item.price)} ₫
                                        </p>
                                        <button
                                            onClick={() => addToCart(item)}
                                            disabled={isAdded}
                                            className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                                                isAdded
                                                    ? "bg-green-600 text-white"
                                                    : "bg-amber-600 hover:bg-amber-500 text-white"
                                            }`}
                                        >
                                            <FontAwesomeIcon icon={isAdded ? faCheckCircle : faShoppingCart} />
                                            {isAdded ? "Đã thêm" : "Thêm vào giỏ"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
