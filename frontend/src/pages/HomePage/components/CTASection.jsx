import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHeadset } from "@fortawesome/free-solid-svg-icons";

export default function CTASection() {
    return (
        <section className="relative overflow-hidden py-20" style={{ contentVisibility: 'auto' }}>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/CTA.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
            <div className="absolute top-10 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-20 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
            <div className="relative max-w-4xl mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 ring-1 ring-white/10">
                    <FontAwesomeIcon icon={faHeadset} className="text-amber-400 text-sm" />
                    <span className="text-white/70 text-sm">Hỗ trợ 24/7</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    Bạn cần tư vấn?
                </h2>
                <p className="text-base md:text-lg text-white/70 mb-10 max-w-lg mx-auto">
                    Đội ngũ chuyên viên của chúng tôi sẵn sàng hỗ trợ bạn 24/7 với mọi thắc mắc về nhạc cụ
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/products"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/25 hover:scale-105 will-change-transform"
                    >
                        Xem sản phẩm
                        <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                    </Link>
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10"
                    >
                        <FontAwesomeIcon icon={faHeadset} className="text-sm" />
                        Liên hệ ngay
                    </Link>
                </div>
            </div>
        </section>
    );
}
