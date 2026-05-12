import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faThLarge, faList, faHeart, faShoppingCart, faStar } from "@fortawesome/free-solid-svg-icons";

const products = [
    {
        id: 1,
        name: "Guitar Acoustic Yamaha F310",
        price: 4500000,
        originalPrice: 5200000,
        image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80",
        rating: 4.5,
        reviews: 128,
        brand: "Yamaha",
        category: "Acoustic",
        badge: "Bestseller"
    },
    {
        id: 2,
        name: "Guitar Classic Cordoba C5",
        price: 6800000,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&q=80",
        rating: 5,
        reviews: 86,
        brand: "Cordoba",
        category: "Classic",
        badge: "New"
    },
    {
        id: 3,
        name: "Guitar Electric Fender Stratocaster",
        price: 18500000,
        originalPrice: 21000000,
        image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=400&q=80",
        rating: 4.8,
        reviews: 215,
        brand: "Fender",
        category: "Electric",
        badge: "Sale"
    },
    {
        id: 4,
        name: "Ukulele Kala KA-15B",
        price: 1200000,
        originalPrice: 1500000,
        image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80",
        rating: 4.3,
        reviews: 64,
        brand: "Kala",
        category: "Ukulele",
        badge: null
    },
    {
        id: 5,
        name: "Guitar Acoustic Taylor 214ce",
        price: 32000000,
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80",
        rating: 4.9,
        reviews: 156,
        brand: "Taylor",
        category: "Acoustic",
        badge: "Premium"
    },
    {
        id: 6,
        name: "Piano Điện Casio CDP-S110",
        price: 8900000,
        originalPrice: 9500000,
        image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=400&q=80",
        rating: 4.6,
        reviews: 92,
        brand: "Casio",
        category: "Piano",
        badge: null
    }
];

const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " đ";
};

export default function ProductsPage() {
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("default");
    const [priceRange, setPriceRange] = useState([0, 50000000]);

    const getBadgeColor = (badge) => {
        switch (badge) {
            case "Bestseller": return "bg-amber-500";
            case "New": return "bg-green-500";
            case "Sale": return "bg-red-500";
            case "Premium": return "bg-purple-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="text-sm mb-6">
                <ol className="flex items-center gap-2 text-gray-500">
                    <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                    <li>/</li>
                    <li className="text-gray-800 font-medium">Sản phẩm</li>
                </ol>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Sản phẩm</h1>
                    <p className="text-gray-500 mt-1">Có {products.length} sản phẩm</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                    >
                        <option value="default">Mặc định</option>
                        <option value="price-asc">Giá: Thấp đến cao</option>
                        <option value="price-desc">Giá: Cao đến thấp</option>
                        <option value="name">Tên A-Z</option>
                        <option value="rating">Đánh giá cao nhất</option>
                    </select>

                    {/* View Mode */}
                    <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 ${viewMode === "grid" ? "bg-amber-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                        >
                            <FontAwesomeIcon icon={faThLarge} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 ${viewMode === "list" ? "bg-amber-500 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                        >
                            <FontAwesomeIcon icon={faList} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-8">
                {/* Sidebar */}
                <aside className="hidden lg:block w-64 shrink-0">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                        <h3 className="font-semibold text-gray-900 mb-4">Danh mục</h3>
                        <ul className="space-y-2">
                            {["Tất cả", "Acoustic", "Classic", "Electric", "Ukulele", "Piano"].map((cat) => (
                                <li key={cat}>
                                    <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition">
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <h3 className="font-semibold text-gray-900 mt-6 mb-4">Thương hiệu</h3>
                        <ul className="space-y-2">
                            {["Yamaha", "Fender", "Taylor", "Cordoba", "Casio"].map((brand) => (
                                <li key={brand} className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500" />
                                    <span className="text-gray-600 text-sm">{brand}</span>
                                </li>
                            ))}
                        </ul>

                        <h3 className="font-semibold text-gray-900 mt-6 mb-4">Khoảng giá</h3>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="0"
                                max="50000000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                className="w-full accent-amber-600"
                            />
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>0đ</span>
                                <span>{formatPrice(priceRange[1])}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:shadow-amber-100 transition-all ${viewMode === "list" ? "flex" : ""}`}
                            >
                                <div className={`relative ${viewMode === "list" ? "w-48 shrink-0" : ""}`}>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={`w-full object-cover ${viewMode === "list" ? "h-full" : "h-56"}`
                                        }
                                    />
                                    {product.badge && (
                                        <span className={`absolute top-3 left-3 px-2 py-1 ${getBadgeColor(product.badge)} text-white text-xs font-semibold rounded`}>
                                            {product.badge}
                                        </span>
                                    )}
                                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition">
                                        <FontAwesomeIcon icon={faHeart} />
                                    </button>
                                </div>

                                <div className={`p-4 ${viewMode === "list" ? "flex-1 flex items-center" : ""}`}>
                                    {viewMode === "list" ? (
                                        <div className="flex-1">
                                            <p className="text-xs text-amber-600 mb-1">{product.brand}</p>
                                            <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FontAwesomeIcon key={i} icon={faStar} className={`text-xs ${i < Math.floor(product.rating) ? "" : "text-gray-300"}`} />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-500">({product.reviews})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-amber-600">{formatPrice(product.price)}</span>
                                                {product.originalPrice && (
                                                    <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-xs text-amber-600 mb-1">{product.brand}</p>
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex text-amber-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FontAwesomeIcon key={i} icon={faStar} className={`text-xs ${i < Math.floor(product.rating) ? "" : "text-gray-300"}`} />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-500">({product.reviews})</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-xl font-bold text-amber-600">{formatPrice(product.price)}</span>
                                                    {product.originalPrice && (
                                                        <span className="text-sm text-gray-400 line-through ml-2">{formatPrice(product.originalPrice)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <button className="w-full mt-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                                        <FontAwesomeIcon icon={faShoppingCart} />
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}