import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faUserGraduate, faClock, faImage, faPlay, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { courseAPI } from "../../api";
import { formatCurrency } from "../../helpers/format";

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        courseAPI.getPublished({ limit: 20 })
            .then(res => setCourses(res.data?.data?.courses || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-white">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-400">
                        <li><Link to="/" className="hover:text-amber-500 transition">Trang chủ</Link></li>
                        <li className="text-gray-300">/</li>
                        <li className="text-gray-600 font-medium">Khóa học</li>
                    </ol>
                </nav>

                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Khóa học</h1>
                    <div className="w-16 h-1 bg-amber-400 rounded-full mt-2" />
                    <p className="text-gray-500 mt-2">Nâng cao kỹ năng chơi nhạc của bạn</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full size-12 border-b-2 border-amber-400" />
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-soft max-w-lg mx-auto">
                        <div className="size-20 mx-auto mb-4 bg-amber-50 rounded-2xl flex items-center justify-center">
                            <FontAwesomeIcon icon={faVideo} className="text-3xl text-amber-400" />
                        </div>
                        <p className="text-gray-600 text-lg font-medium mb-2">Chưa có khóa học nào</p>
                        <p className="text-gray-400 text-sm mb-6">Các khóa học sẽ được cập nhật sớm</p>
                        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white rounded-full font-medium transition shadow-sm">
                            Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Link key={course._id} to={`/courses/${course.slug}`}
                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-soft hover:shadow-pop hover:border-amber-200 transition-all duration-300"
                            >
                                <div className="h-48 bg-gray-100 overflow-hidden relative">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} loading="lazy" decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <FontAwesomeIcon icon={faImage} className="text-4xl" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white text-xs font-medium">
                                        <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                                            <FontAwesomeIcon icon={faVideo} className="text-[10px]" />
                                            {course.lessons?.length || 0} bài học
                                        </span>
                                        {course.lessons?.length > 0 && course.lessons[0]?.duration && (
                                            <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                                                <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                                                {course.lessons[0].duration}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-5">
                                    {course.category?.name && (
                                        <p className="text-[11px] font-semibold tracking-wider uppercase text-amber-500 mb-1.5">{course.category.name}</p>
                                    )}
                                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 leading-snug">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{course.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xl font-bold text-amber-600">{formatCurrency(course.price)}</p>
                                            {course.instructor && (
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                                    <FontAwesomeIcon icon={faUserGraduate} className="text-[10px]" />
                                                    {course.instructor}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-sm text-amber-500 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-medium">
                                            Xem thêm <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
