import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHeadset } from "@fortawesome/free-solid-svg-icons";
import { useInView } from "../../../hooks/useInView";

export default function CTASection({ data }) {
    const [ref, inView] = useInView({ rootMargin: "200px" });
    const videoRef = useRef(null);

    const badgeText = data?.badgeText || "Hỗ trợ 24/7";
    const title = data?.title || "Bạn cần tư vấn?";
    const description = data?.description || "Đội ngũ chuyên viên của chúng tôi sẵn sàng hỗ trợ bạn 24/7 với mọi thắc mắc về nhạc cụ";
    const primaryButtonText = data?.primaryButtonText || "Xem sản phẩm";
    const primaryButtonLink = data?.primaryButtonLink || "/products";
    const secondaryButtonText = data?.secondaryButtonText || "Liên hệ ngay";
    const secondaryButtonLink = data?.secondaryButtonLink || "/contact";
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
            className="relative overflow-hidden py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900"
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
            <div className="absolute top-10 -left-20 size-80 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-20 size-96 bg-amber-400/5 rounded-full blur-3xl" />
            <div className="relative max-w-4xl mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 ring-1 ring-white/10">
                    <FontAwesomeIcon icon={faHeadset} className="text-amber-400 text-sm" />
                    <span className="text-white/70 text-sm">{badgeText}</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {title}
                </h2>
                <p className="text-base md:text-lg text-white/70 mb-10 max-w-lg mx-auto">
                    {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to={primaryButtonLink}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/25 hover:scale-105 will-change-transform"
                    >
                        {primaryButtonText}
                        <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                    </Link>
                    <Link
                        to={secondaryButtonLink}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40 hover:shadow-lg hover:shadow-white/10"
                    >
                        <FontAwesomeIcon icon={faHeadset} className="text-sm" />
                        {secondaryButtonText}
                    </Link>
                </div>
            </div>
        </section>
    );
}
