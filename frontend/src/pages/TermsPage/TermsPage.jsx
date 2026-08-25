import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumb from "../../components/Breadcrumb";
import {
    faFileContract,
    faShieldHalved,
    faTruck,
    faRotateLeft,
    faQuestionCircle,
    faArrowUp,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import useTermsData from "./hooks/useTermsData";

const sectionIcons = [faFileContract, faShieldHalved, faTruck, faRotateLeft, faQuestionCircle];

function TableOfContents({ sections, activeIndex }) {
    return (
        <nav className="sticky top-28">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
                Muc luc
            </h3>
            <ul className="space-y-1">
                {sections.map((section, i) => (
                    <li key={i}>
                        <a
                            href={`#section-${i}`}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                activeIndex === i
                                    ? "bg-amber-50 text-amber-700 font-medium border-l-2 border-amber-400"
                                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            }`}
                        >
                            <FontAwesomeIcon
                                icon={sectionIcons[i % sectionIcons.length]}
                                className="text-xs w-4 text-center shrink-0"
                            />
                            <span className="truncate">{section.title}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

function SectionCard({ section, index }) {
    const Icon = sectionIcons[index % sectionIcons.length];
    return (
        <section id={`section-${index}`} className="scroll-mt-28">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
                <div className="flex items-center gap-3 px-6 sm:px-8 py-5 bg-gradient-to-r from-amber-50 to-white border-b border-gray-50">
                    <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={Icon} className="text-amber-600 text-sm" />
                    </div>
                    <div>
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-400">
                            Phan {index + 1}
                        </span>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                            {section.title}
                        </h2>
                    </div>
                </div>
                <div className="px-6 sm:px-8 py-6">
                    <div className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                        {section.content}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function TermsPage() {
    const { content, loading } = useTermsData();
    const [activeSection, setActiveSection] = useState(0);
    const [showTop, setShowTop] = useState(false);
    const observerRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!content?.sections?.length) return;

        observerRef.current?.disconnect();

        const callbacks = content.sections.map((_, i) => (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) setActiveSection(i);
            });
        });

        const observers = callbacks.map((cb, i) => {
            const el = document.getElementById(`section-${i}`);
            if (!el) return null;
            const obs = new IntersectionObserver(cb, { rootMargin: "-20% 0px -60% 0px", threshold: 0 });
            obs.observe(el);
            return obs;
        });

        return () => observers.forEach((obs) => obs?.disconnect());
    }, [content?.sections?.length]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full size-12 border-b-2 border-amber-400" />
            </div>
        );
    }

    const header = content?.header || {};
    const sections = content?.sections || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <section className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
                    <Breadcrumb
                        items={[
                            { label: "Trang chu", href: "/" },
                            { label: header.breadcrumbLabel || "Dieu khoan & Bao mat" },
                        ]}
                    />
                    <div className="max-w-3xl">
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-500 mb-3">
                            Terms & Privacy
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
                            {header.title || "Dieu khoan & Bao mat"}
                        </h1>
                        {header.description && (
                            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
                                {header.description}
                            </p>
                        )}
                        {header.lastUpdated && (
                            <p className="text-sm text-gray-400 mt-4">
                                Cap nhat lan cuoi: {header.lastUpdated}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                {sections.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <FontAwesomeIcon icon={faFileContract} className="text-gray-300 text-2xl" />
                        </div>
                        <p className="text-gray-400">Noi dung dang duoc cap nhat...</p>
                    </div>
                ) : (
                    <div className="flex gap-10 lg:gap-14">
                        {/* Sidebar TOC - desktop only */}
                        <aside className="hidden lg:block w-56 shrink-0">
                            <TableOfContents sections={sections} activeIndex={activeSection} />
                        </aside>

                        {/* Sections */}
                        <div className="flex-1 min-w-0 space-y-6">
                            {sections.map((section, i) => (
                                <SectionCard key={i} section={section} index={i} />
                            ))}

                            {/* Bottom CTA */}
                            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl p-6 sm:p-8 text-center">
                                <p className="text-gray-700 text-sm sm:text-base mb-4">
                                    Ban co cau hoi ve dieu khoan hoac chinh sach bao mat?
                                </p>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-xl font-medium transition shadow-sm hover:shadow-md text-sm"
                                >
                                    Lien he chung toi
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Back to top */}
            {showTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 size-11 rounded-full bg-white border border-gray-200 shadow-lg flex items-center justify-center text-gray-500 hover:text-amber-500 hover:border-amber-300 transition-all duration-200 z-50"
                    aria-label="Ve dau trang"
                >
                    <FontAwesomeIcon icon={faArrowUp} className="text-sm" />
                </button>
            )}
        </div>
    );
}
