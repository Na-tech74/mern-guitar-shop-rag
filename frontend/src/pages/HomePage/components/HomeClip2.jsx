import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faHeadset } from "@fortawesome/free-solid-svg-icons";
import { useInView } from "../../../hooks/useInView";

export default function Clip2({ data }) {
    const [ref, inView] = useInView({ rootMargin: "200px" });
    const videoRef = useRef(null);
    const videoUrl = data?.videoUrl;

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;
        if (inView) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, [inView, videoUrl]);

    if (!data) return null;

    const { badgeText, title, description, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink } = data;

    return (
        <section
            ref={ref}
            className="relative overflow-hidden py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
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
            <div className="relative max-w-4xl mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                    <FontAwesomeIcon icon={faHeadset} className="text-white/60 text-sm" />
                    <span className="text-white/70 text-sm">{badgeText}</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    {title}
                </h2>
                <p className="text-base md:text-lg text-white/60 mb-10 max-w-lg mx-auto">
                    {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to={primaryButtonLink}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors"
                    >
                        {primaryButtonText}
                        <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                    </Link>
                    <Link
                        to={secondaryButtonLink}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
                    >
                        <FontAwesomeIcon icon={faHeadset} className="text-sm" />
                        {secondaryButtonText}
                    </Link>
                </div>
            </div>
        </section>
    );
}
