import { Link } from "react-router-dom";

export default function BannerPromotion() {
    return (
        <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-700">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Giảm giá lên đến 30%</h2>
                        <p className="text-lg mb-6 opacity-90">Dành cho khách hàng mua lần đầu. Áp dụng cho tất cả sản phẩm guitar acoustic và classic.</p>
                        <Link 
                            to="/products" 
                            className="inline-block px-8 py-3 bg-white text-amber-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Mua ngay
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <img 
                            src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80" 
                            alt="Guitar" 
                            className="rounded-xl shadow-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}