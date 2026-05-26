import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faVideo, faUserGraduate, faClock, faImage, faPlay,
    faChevronDown, faChevronUp, faFileAlt, faArrowLeft,
    faCheckCircle, faCircle
} from "@fortawesome/free-solid-svg-icons";
import { courseAPI } from "../AdminPage/api/adminAPI";
import { formatCurrency } from "../../helpers/format";
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
                <FontAwesomeIcon icon={faImage} className="text-5xl mb-4" />
                <p className="text-lg">Khóa học không tồn tại</p>
                <Link to="/courses" className="mt-4 text-amber-600 hover:underline">Quay lại</Link>
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
        <div className="min-h-screen bg-gray-50">
            <div className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <nav className="text-sm mb-4 text-gray-500">
                        <ol className="flex items-center gap-2">
                            <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                            <li>/</li>
                            <li><Link to="/courses" className="hover:text-amber-600">Khóa học</Link></li>
                            <li>/</li>
                            <li className="text-gray-900 font-medium truncate">{course.title}</li>
                        </ol>
                    </nav>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                            <p className="text-gray-600 line-clamp-2">{course.description}</p>
                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                                {course.instructor && (
                                    <span className="flex items-center gap-1.5">
                                        <FontAwesomeIcon icon={faUserGraduate} />
                                        {course.instructor}
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faVideo} />
                                    {lessons.length} bài học
                                </span>
                                <span className="text-lg font-bold text-amber-600 ml-auto">
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
                            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
                                <iframe
                                    src={getYoutubeEmbedUrl(lesson.videoUrl)}
                                    title={lesson.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center mb-6">
                                <div className="text-center text-gray-400">
                                    <FontAwesomeIcon icon={faPlay} className="text-4xl mb-2" />
                                    <p className="text-sm">Video sẽ được cập nhật</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {lesson?.title || "Chọn bài học để bắt đầu"}
                            </h2>
                            {lesson?.duration && (
                                <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                                    <FontAwesomeIcon icon={faClock} />
                                    {lesson.duration}
                                </p>
                            )}
                            {lesson?.content ? (
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                                    {lesson.content}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic">Chưa có nội dung cho bài học này</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <button
                            onClick={() => setShowLessons(!showLessons)}
                            className="w-full flex items-center justify-between p-4 border-b border-gray-100 lg:cursor-default"
                        >
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faVideo} className="text-amber-600" />
                                Danh sách bài học
                                <span className="text-sm font-normal text-gray-500">({lessons.length})</span>
                            </h3>
                            <FontAwesomeIcon icon={showLessons ? faChevronUp : faChevronDown} className="text-gray-400 lg:hidden" />
                        </button>
                        {showLessons && (
                            <div className="p-2 max-h-[500px] overflow-y-auto">
                                {lessons.length === 0 ? (
                                    <p className="text-center py-8 text-gray-400 text-sm">Chưa có bài học nào</p>
                                ) : (
                                    <div className="space-y-1">
                                        {lessons.map((l, idx) => (
                                            <button
                                                key={l._id || idx}
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
                                                            currentLesson === idx ? "text-amber-600" :
                                                            idx < currentLesson ? "text-green-500" : "text-gray-300"
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
