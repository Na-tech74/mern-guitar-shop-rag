import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShoppingCart, faTrash, faImage } from "@fortawesome/free-solid-svg-icons";

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishlist(stored);
    }, []);

    const removeFromWishlist = (index) => {
        const updated = wishlist.filter((_, i) => i !== index);
        setWishlist(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Yêu thích</li>
                    </ol>
                </nav>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Sản phẩm yêu thích</h1>

                {wishlist.length === 0 ? (
                    <div className="text-center py-16">
                        <FontAwesomeIcon icon={faHeart} className="text-6xl text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg mb-6">Chưa có sản phẩm yêu thích nào</p>
                        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition">
                            Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlist.map((item, index) => (
                            <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
                                <Link to={`/products/${item._id}`} className="block h-48 bg-gray-100 overflow-hidden">
                                    {item.images?.[0] ? (
                                        <img src={item.images[0]} alt={item.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FontAwesomeIcon icon={faImage} className="text-3xl" />
                                        </div>
                                    )}
                                </Link>
                                <div className="p-4">
                                    <Link to={`/products/${item._id}`} className="font-semibold text-gray-800 line-clamp-1 hover:text-amber-600">{item.name}</Link>
                                    <p className="text-amber-600 font-bold mt-1">{new Intl.NumberFormat("vi-VN").format(item.price)} ₫</p>
                                    <div className="flex gap-2 mt-3">
                                        <button className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm rounded-lg transition flex items-center justify-center gap-1">
                                            <FontAwesomeIcon icon={faShoppingCart} />
                                            Thêm
                                        </button>
                                        <button onClick={() => removeFromWishlist(index)} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-red-600 hover:border-red-200 transition">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
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
