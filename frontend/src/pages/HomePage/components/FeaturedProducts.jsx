import { memo } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faArrowRight, faMusic } from "@fortawesome/free-solid-svg-icons";
import { getOptimizedImage } from "../../../helpers/format";

export default function FeaturedProducts({ products, loading }) {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-700 mb-2">Sản phẩm nổi bật</h2>
                        <p className="text-gray-500">Những sản phẩm được yêu thích nhất</p>
                    </div>
                    <Link to="/products" className="hidden md:flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium">
                        Xem tất cả <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-xl animate-pulse overflow-hidden">
                                <div className="h-60 bg-gray-200" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                                    <div className="pt-2 flex justify-between">
                                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                                        <div className="h-4 bg-gray-200 rounded w-1/6" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product, i) => (
                            <div key={product._id} className="animate-fadeInUp" style={{ animationDelay: `${i * 60}ms` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FontAwesomeIcon icon={faMusic} className="text-5xl text-gray-300 mb-4" />
                        <p className="text-gray-500">Chưa có sản phẩm nào</p>
                    </div>
                )}

                <div className="text-center mt-8 md:hidden">
                    <Link to="/products" className="inline-flex items-center gap-2 text-amber-600 font-medium">
                        Xem tất cả sản phẩm <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

const ProductCard = memo(function ProductCard({ product }) {
    return (
        <Link to={`/products/${product._id}`} className="group bg-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300">
            <div className="relative overflow-hidden rounded-t-xl">
                <img 
                    src={getOptimizedImage(product.images?.[0], 400) || "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80"} 
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-60 object-cover"
                />
                {product.sold > 0 && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded">
                        Hot
                    </div>
                )}
            </div>
            <div className="p-4 bg-gray-200 rounded-b-xl">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 group-hover:text-amber-600">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {product.description}
                </p>
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-lg font-bold text-amber-600">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                        <FontAwesomeIcon icon={faStar} className="text-xs" />
                        <span className="text-sm text-gray-500">4.5</span>
                    </div>
                </div>
            </div>
        </Link>
    );
});