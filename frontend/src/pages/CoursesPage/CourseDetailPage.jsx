import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faVideo, faUserGraduate, faClock, faImage, faPlay,
    faChevronDown, faChevronUp, faFileAlt, faArrowLeft,
    faCheckCircle, faCircle
} from "@fortawesome/free-solid-svg-icons";
import { courseAPI } from "../../api";
import { formatCurrency } from "../../helpers/formatters";
import Button from "../../components/Button";

export default function CourseDetailPage() {
    const { slug } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentLesson, setCurrentLesson] = useState(0);
    const [showLessons, setShowLessons] = useState(true);

    useEffect(() => {
        courseAPI.getBySlug(slug)
            .then(res => setCourse(res.data?.data?.course))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full size-12 border-b-2 border-amber-400" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="size-20 rounded-2xl bg-amber-50 flex items-center justify-center mb-5">
                    <FontAwesomeIcon icon={faImage} className="text-4xl text-amber-400" />
                </div>
                <p className="text-gray-600 text-lg font-medium mb-2">Khóa học không tồn tại</p>
                <p className="text-gray-400 text-sm mb-6">Có thể khóa học đã bị xoá hoặc đường dẫn không đúng</p>
                <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-full font-medium transition shadow-sm">
                    Quay lại khóa học
                </Link>
            </div>
        );
    }

    const lessons = course.lessons || [];
    const lesson = lessons[currentLesson];

    const getYoutubeEmbedUrl = (url) => {
        if (!url) return "";
        const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="border-b border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <nav className="text-sm mb-4">
                        <ol className="flex items-center gap-2 text-gray-400">
                            <li><Link to="/" className="hover:text-amber-500 transition">Trang chủ</Link></li>
                            <li className="text-gray-300">/</li>
                            <li><Link to="/courses" className="hover:text-amber-500 transition">Khóa học</Link></li>
                            <li className="text-gray-300">/</li>
                            <li className="text-gray-600 font-medium truncate max-w-[200px]">{course.title}</li>
                        </ol>
                    </nav>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                            <p className="text-gray-500 line-clamp-2">{course.description}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                                {course.instructor && (
                                    <span className="flex items-center gap-1.5 text-gray-400">
                                        <FontAwesomeIcon icon={faUserGraduate} />
                                        {course.instructor}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5 text-gray-400">
                                    <FontAwesomeIcon icon={faVideo} />
                                    {lessons.length} bài học
                                </span>
                                <span className="text-xl font-bold text-amber-600 ml-auto">
                                    {formatCurrency(course.price)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        {lesson?.videoUrl ? (
                            <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6 shadow-soft">
                                <iframe
                                    src={getYoutubeEmbedUrl(lesson.videoUrl)}
                                    title={lesson.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="aspect-video bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
                                <div className="text-center">
                                    <div className="size-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                                        <FontAwesomeIcon icon={faPlay} className="text-2xl text-amber-400" />
                                    </div>
                                    <p className="text-gray-400 text-sm">Video sẽ được cập nhật</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-soft">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {lesson?.title || "Chọn bài học để bắt đầu"}
                            </h2>
                            <div className="w-10 h-0.5 bg-amber-400 rounded-full mb-4" />
                            {lesson?.duration && (
                                <p className="text-sm text-gray-400 flex items-center gap-1 mb-4">
                                    <FontAwesomeIcon icon={faClock} />
                                    {lesson.duration}
                                </p>
                            )}
                            {lesson?.content ? (
                                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">
                                    {lesson.content}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic">Chưa có nội dung cho bài học này</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-soft max-h-[600px] flex flex-col">
                        <div className="shrink-0 p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faVideo} className="text-amber-500" />
                                Danh sách bài học
                                <span className="text-sm font-normal text-gray-400">({lessons.length})</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowLessons(!showLessons)}
                                className="text-gray-400 hover:text-gray-600 transition lg:hidden"
                            >
                                <FontAwesomeIcon icon={showLessons ? faChevronUp : faChevronDown} />
                            </button>
                        </div>
                        {showLessons && (
                            <div className="p-2 overflow-y-auto flex-1">
                                {lessons.length === 0 ? (
                                    <p className="text-center py-8 text-gray-400 text-sm">Chưa có bài học nào</p>
                                ) : (
                                    <div className="space-y-1">
                                        {lessons.map((l, idx) => (
                                            <button
                                                key={l._id || idx}
                                                type="button"
                                                onClick={() => setCurrentLesson(idx)}
                                                className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 ${
                                                    currentLesson === idx
                                                        ? "bg-amber-50 border border-amber-200"
                                                        : "hover:bg-gray-50 border border-transparent"
                                                }`}
                                            >
                                                <span className="mt-0.5 shrink-0">
                                                    <FontAwesomeIcon
                                                        icon={currentLesson === idx ? faPlay : idx < currentLesson ? faCheckCircle : faCircle}
                                                        className={`text-sm ${
                                                            currentLesson === idx ? "text-amber-500" :
                                                            idx < currentLesson ? "text-emerald-500" : "text-gray-300"
                                                        }`}
                                                    />
                                                </span>
                                                <div className="min-w-0 flex-1">
                                                    <p className={`text-sm font-medium truncate ${
                                                        currentLesson === idx ? "text-amber-700" : "text-gray-700"
                                                    }`}>
                                                        {l.title || `Bài ${idx + 1}`}
                                                    </p>
                                                    {l.duration && (
                                                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                            <FontAwesomeIcon icon={faClock} />
                                                            {l.duration}
                                                        </p>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
