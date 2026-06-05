import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useInView } from "../../../hooks/useInView";

export default function Clip({ data }) {
    const [ref, inView] = useInView({ rootMargin: "200px" });
    const videoRef = useRef(null);

    const title = data?.title || "Giảm giá lên đến 30%";
    const description = data?.description || "Dành cho khách hàng mua lần đầu. Áp dụng cho tất cả sản phẩm guitar acoustic và classic.";
    const buttonText = data?.buttonText || "Mua ngay";
    const buttonLink = data?.buttonLink || "/products";
    // Video do admin upload lên Cloudinary. Nếu chưa có thì section vẫn render
    // với background gradient mặc định, không cần fallback file local.
    const videoUrl = data?.videoUrl || "";

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;
        if (inView) {
            video.play().catch(() => { /* autoplay có thể bị chặn, bỏ qua */ });
        } else {
            video.pause();
        }
    }, [inView, videoUrl]);

    return (
        <section
            ref={ref}
            className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900"
            style={{ contentVisibility: 'auto' }}
        >
            {videoUrl && (
                <video
                    ref={videoRef}
                    key={videoUrl}
                    loop
                    muted
                    playsInline
                    preload="none"
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={videoUrl} type="video/mp4" />
                </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-28">
                <div className="max-w-xl text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
                    <p className="text-lg mb-6 opacity-90">{description}</p>
                    <Link
                        to={buttonLink}
                        className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors"
                    >
                        {buttonText}
                    </Link>
                </div>
            </div>
        </section>
    );
}
