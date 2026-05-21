import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMinus, faPlus, faShoppingCart, faStar, faTruck, faShieldAlt, faUndo, faImage } from "@fortawesome/free-solid-svg-icons";
import { productAPI } from "../api/productAPI";
import { getOptimizedImage } from "../../../helpers/format";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + " đ";

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        productAPI.getById(id)
            .then((res) => {
                setProduct(res.data?.data?.product);
                setSelectedImage(0);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
                <FontAwesomeIcon icon={faImage} className="text-5xl mb-4" />
                <p className="text-lg">Sản phẩm không tồn tại</p>
                <Link to="/products" className="mt-4 text-amber-600 hover:underline">Quay lại</Link>
            </div>
        );
    }

    const images = product.images?.length > 0 ? product.images : [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav className="text-sm mb-6">
                <ol className="flex items-center gap-2 text-gray-500">
                    <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                    <li>/</li>
                    <li><Link to="/products" className="hover:text-amber-600">Sản phẩm</Link></li>
                    <li>/</li>
                    <li className="text-gray-800 font-medium">{product.name}</li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div>
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
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
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                                        selectedImage === idx ? "border-amber-500" : "border-transparent hover:border-gray-300"
                                    }`}
                                >
                                    <img src={getOptimizedImage(img, 150)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div>
                        {product.category?.name && (
                            <p className="text-amber-600 font-medium mb-2">{product.category.name}</p>
                        )}
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-6">
                        <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-3xl font-bold text-amber-600">{formatPrice(product.price)}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Mô tả</h3>
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50">
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className="px-4 font-medium">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-50">
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                        <button className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faShoppingCart} />
                            Thêm vào giỏ
                        </button>
                        <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-red-500 transition">
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FontAwesomeIcon icon={faTruck} className="text-amber-600" />
                            Miễn phí giao hàng
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FontAwesomeIcon icon={faShieldAlt} className="text-amber-600" />
                            Bảo hành 12 tháng
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FontAwesomeIcon icon={faUndo} className="text-amber-600" />
                            Đổi trả 7 ngày
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
