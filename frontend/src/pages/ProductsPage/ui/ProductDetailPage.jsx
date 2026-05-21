import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMinus, faPlus, faShoppingCart, faStar, faTruck, faShieldAlt, faUndo } from "@fortawesome/free-solid-svg-icons";

const product = {
    id: 1,
    name: "Guitar Acoustic Yamaha F310",
    price: 4500000,
    originalPrice: 5200000,
    images: [
        "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&q=80",
        "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&q=80",
        "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800&q=80"
    ],
    rating: 4.5,
    reviews: 128,
    brand: "Yamaha",
    category: "Acoustic",
    description: "Guitar Acoustic Yamaha F310 là lựa chọn hoàn hảo cho người mới bắt đầu học guitar. Với thân đàn bằng gỗ spruce và lưng/hông bằng gỗ nato, cây đàn mang lại âm thanh cân bằng và ấm áp. Đàn phù hợp cho nhiều thể loại nhạc từ ballad đến pop.",
    specs: {
        "Loại": "Acoustic",
        "Thương hiệu": "Yamaha",
        "Mặt trước": "Spruce",
        "Lưng/Hông": "Nato",
        "Cần đàn": "Nato",
        "Số phím": "20"
    }
};

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price) + " đ";

export default function ProductDetailPage() {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
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
                {/* Images */}
                <div>
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                        <img
                            src={product.images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex gap-3">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                                    selectedImage === idx ? "border-amber-500" : "border-transparent hover:border-gray-300"
                                }`}
                            >
                                <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-6">
                    <div>
                        <p className="text-amber-600 font-medium mb-2">{product.brand}</p>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <FontAwesomeIcon key={i} icon={faStar} className={`text-amber-400 ${i < Math.floor(product.rating) ? "" : "text-gray-300"}`} />
                                ))}
                            </div>
                            <span className="text-gray-500">{product.rating} ({product.reviews} đánh giá)</span>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-6">
                        <div className="flex items-baseline gap-3 mb-2">
                            <span className="text-3xl font-bold text-amber-600">{formatPrice(product.price)}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                            )}
                        </div>
                        {product.originalPrice && (
                            <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
                                Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                            </span>
                        )}
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Mô tả</h3>
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Thông số kỹ thuật</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">{key}</span>
                                    <span className="font-medium text-gray-800">{value}</span>
                                </div>
                            ))}
                        </div>
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