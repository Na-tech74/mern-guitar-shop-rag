import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faImage } from "@fortawesome/free-solid-svg-icons";
import { API } from "../../api/axiosClient";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;
        setLoading(true);
        API.get("/products", { params: { search: query } })
            .then((res) => setResults(res.data?.data?.products || []))
            .catch(() => setResults([]))
            .finally(() => setLoading(false));
    }, [query]);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Tìm kiếm</li>
                    </ol>
                </nav>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Kết quả tìm kiếm</h1>
                <p className="text-gray-500 mb-8">
                    {query ? `Từ khóa: "${query}"` : "Vui lòng nhập từ khóa tìm kiếm"}
                </p>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
                    </div>
                ) : results.length === 0 && query ? (
                    <div className="text-center py-16">
                        <FontAwesomeIcon icon={faSearch} className="text-5xl text-gray-300 mb-4" />
                        <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {results.map((product) => (
                            <Link key={product._id} to={`/products/${product._id}`} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
                                <div className="h-48 bg-gray-100 overflow-hidden">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FontAwesomeIcon icon={faImage} className="text-3xl" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-amber-600">{product.name}</h3>
                                    <p className="text-amber-600 font-bold mt-1">{new Intl.NumberFormat("vi-VN").format(product.price)} ₫</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
