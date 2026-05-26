import { Link } from "react-router-dom";
import guitarVideo from "../../../assets/images/guitar.mp4";

export default function Clip() {
    return (
        <section className="relative overflow-hidden" style={{ contentVisibility: 'auto' }}>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src={guitarVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28">
                <div className="max-w-xl text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Giảm giá lên đến 30%</h2>
                    <p className="text-lg mb-6 opacity-90">Dành cho khách hàng mua lần đầu. Áp dụng cho tất cả sản phẩm guitar acoustic và classic.</p>
                    <Link
                        to="/products"
                        className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-lg transition-colors"
                    >
                        Mua ngay
                    </Link>
                </div>
            </div>
        </section>
    );
}