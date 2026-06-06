import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMinus, faPlus, faShoppingCart, faTruck, faShieldAlt, faUndo, faImage, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { productAPI } from "../../api";
import { getOptimizedImage, formatCurrency } from "../../helpers/format";
import Skeleton from "../../components/Skeleton";
import useCart from "./hooks/useCart";

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { addToCart, addedMap } = useCart();
    const [inWishlist, setInWishlist] = useState(false);

    useEffect(() => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setInWishlist(wishlist.some(item => item._id === id));
    }, [id]);

    const toggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        if (inWishlist) {
            const updated = wishlist.filter(item => item._id !== id);
            localStorage.setItem("wishlist", JSON.stringify(updated));
            setInWishlist(false);
        } else {
            wishlist.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                images: product.images,
            });
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            setInWishlist(true);
        }
        window.dispatchEvent(new Event("wishlist-updated"));
    };

    useEffect(() => {
        productAPI.getById(id)
            .then((res) => {
                setProduct(res.data?.data?.product ?? null);
                setSelectedImage(0);
            })
            .catch(() => {})
            .finally(() => setLoaded(true));
    }, [id]);

    if (!loaded) {
        return <Skeleton.ProductDetail />;
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="size-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
                    <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-300" />
                </div>
                <p className="text-gray-600 text-lg font-medium mb-2">Sản phẩm không tồn tại</p>
                <p className="text-gray-400 text-sm mb-6">Có thể sản phẩm đã bị xoá hoặc đường dẫn không đúng</p>
                <Link to="/products" className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-full font-medium transition shadow-sm">
                    Quay lại cửa hàng
                </Link>
            </div>
        );
    }

    const images = product.images?.length > 0 ? product.images : [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav className="text-sm mb-8">
                <ol className="flex items-center gap-2 text-gray-400">
                    <li><Link to="/" className="hover:text-amber-500 transition">Trang chủ</Link></li>
                    <li className="text-gray-300">/</li>
                    <li><Link to="/products" className="hover:text-amber-500 transition">Sản phẩm</Link></li>
                    <li className="text-gray-300">/</li>
                    <li className="text-gray-600 font-medium truncate max-w-[200px]">{product.name}</li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Image gallery */}
                <div>
                    <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-soft">
                        {images.length > 0 ? (
                            <img
                                src={getOptimizedImage(images[selectedImage], 800)}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                loading="eager"
                                decoding="async"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <FontAwesomeIcon icon={faImage} className="text-6xl" />
                            </div>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-3">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedImage(idx)}
                                    className={`size-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                        selectedImage === idx
                                            ? "border-amber-400 shadow-sm ring-1 ring-amber-400/30"
                                            : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    <img src={getOptimizedImage(img, 150)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product info */}
                <div className="space-y-6">
                    <div>
                        {product.category?.name && (
                            <p className="text-xs font-semibold tracking-wider uppercase text-amber-500 mb-2">
                                {product.category.name}
                            </p>
                        )}
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
                    </div>

                    {/* Price */}
                    <div className="bg-amber-50 rounded-2xl p-6">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl lg:text-4xl font-bold text-amber-600">{formatCurrency(product.price * quantity)}</span>
                            {quantity > 1 && (
                                <span className="text-sm text-amber-400">
                                    ({formatCurrency(product.price)} × {quantity})
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-3">
                        {product.stock > 0 ? (
                            <>
                                <span className="flex items-center gap-1.5 text-sm text-emerald-600 bg-emerald-50 rounded-full px-3.5 py-1.5 font-medium">
                                    <span className="size-1.5 rounded-full bg-emerald-500" />
                                    Còn hàng
                                </span>
                                <span className="text-sm text-gray-400">
                                    ({product.stock} sản phẩm)
                                </span>
                            </>
                        ) : (
                            <span className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 rounded-full px-3.5 py-1.5 font-medium">
                                <FontAwesomeIcon icon={faXmark} className="text-xs" />
                                Hết hàng
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Mô tả sản phẩm</h3>
                        <div className="w-10 h-0.5 bg-amber-400 rounded-full mb-3" />
                        <p className="text-gray-500 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-3 hover:bg-amber-50 hover:text-amber-500 transition text-gray-600"
                            >
                                <FontAwesomeIcon icon={faMinus} className="text-sm" />
                            </button>
                            <span className="px-5 font-medium text-gray-800 min-w-[3rem] text-center">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                                className="p-3 hover:bg-amber-50 hover:text-amber-500 transition text-gray-600"
                            >
                                <FontAwesomeIcon icon={faPlus} className="text-sm" />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => addToCart(product, quantity)}
                            disabled={product.stock === 0}
                            className={`flex-1 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-sm ${
                                product.stock === 0
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : addedMap[product._id]
                                        ? "bg-emerald-500 text-white"
                                        : "bg-amber-400 hover:bg-amber-500 text-white hover:shadow-md"
                            }`}
                        >
                            <FontAwesomeIcon icon={addedMap[product._id] ? faCheck : faShoppingCart} />
                            {product.stock === 0 ? "Hết hàng" : addedMap[product._id] ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
                        </button>
                        <button
                            type="button"
                            onClick={toggleWishlist}
                            className={`p-3.5 border rounded-xl transition ${
                                inWishlist
                                    ? "bg-red-50 border-red-200 text-red-500"
                                    : "border-gray-200 hover:bg-red-50 hover:text-red-500 text-gray-500"
                            }`}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 text-sm">
                            <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                <FontAwesomeIcon icon={faTruck} className="text-amber-500 text-sm" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Miễn phí giao hàng</p>
                                <p className="text-gray-400 text-xs">Cho đơn trên 500k</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 text-sm">
                            <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                <FontAwesomeIcon icon={faShieldAlt} className="text-amber-500 text-sm" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Bảo hành 12 tháng</p>
                                <p className="text-gray-400 text-xs">Chính hãng 100%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 text-sm">
                            <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUndo} className="text-amber-500 text-sm" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Đổi trả 7 ngày</p>
                                <p className="text-gray-400 text-xs">Hoàn tiền nhanh chóng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
