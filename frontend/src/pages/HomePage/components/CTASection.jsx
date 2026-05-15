import { Link } from "react-router-dom";

export default function CTASection() {
    return (
        <section className="py-16 bg-gray-800">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Bạn cần tư vấn?</h2>
                <p className="text-white/80 mb-8">Đội ngũ chuyên viên của chúng tôi sẵn sàng hỗ trợ bạn 24/7</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        to="/products" 
                        className="px-8 py-3 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        Xem sản phẩm
                    </Link>
                    <Link 
                        to="/contact" 
                        className="px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Liên hệ ngay
                    </Link>
                </div>
            </div>
        </section>
    );
}