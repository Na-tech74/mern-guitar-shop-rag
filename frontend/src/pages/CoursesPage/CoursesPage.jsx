import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faUserGraduate, faClock, faImage, faPlay, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { courseAPI } from "../../api";
import { formatCurrency } from "../../helpers/formatters";
import Breadcrumb from "../../components/Breadcrumb";

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
                <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Khóa học" }]} />

                <div className="mb-8 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Khóa học</h1>
                    <div className="w-12 sm:w-16 h-1 bg-amber-400 rounded-full mt-2" />
                    <p className="text-sm sm:text-base text-gray-500 mt-2">Nâng cao kỹ năng chơi nhạc của bạn</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full size-10 sm:size-12 border-b-2 border-amber-400" />
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-gray-100 shadow-soft max-w-lg mx-auto px-4 sm:px-6">
                        <div className="size-16 sm:size-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                            <FontAwesomeIcon icon={faVideo} className="text-2xl sm:text-3xl text-gray-400" />
                        </div>
                        <p className="text-gray-700 text-base sm:text-lg font-medium mb-1">Chưa có khóa học nào</p>
                        <p className="text-gray-400 text-xs sm:text-sm mb-5 sm:mb-6">Các khóa học sẽ được cập nhật sớm</p>
                        <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-lg font-medium transition shadow-sm text-sm">
                            Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {courses.map((course) => (
                            <Link key={course._id} to={`/courses/${course.slug}`}
                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden group shadow-soft hover:shadow-pop hover:border-amber-200 transition-all duration-300"
                            >
                                <div className="h-40 sm:h-44 lg:h-48 bg-gray-100 overflow-hidden relative">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} loading="lazy" decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <FontAwesomeIcon icon={faImage} className="text-3xl sm:text-4xl" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-[11px] sm:text-xs font-medium">
                                        <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 sm:px-2.5 sm:py-1">
                                            <FontAwesomeIcon icon={faVideo} className="text-[10px]" />
                                            {course.lessons?.length || 0} bài
                                        </span>
                                        {course.lessons?.length > 0 && course.lessons[0]?.duration && (
                                            <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1 sm:px-2.5 sm:py-1">
                                                <FontAwesomeIcon icon={faClock} className="text-[10px]" />
                                                {course.lessons[0].duration}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 sm:p-5">
                                    {course.category?.name && (
                                        <p className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-amber-500 mb-1">{course.category.name}</p>
                                    )}
                                    <h3 className="font-semibold text-gray-800 mb-1.5 line-clamp-2 leading-snug text-sm sm:text-base">
                                        {course.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">{course.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base sm:text-xl font-bold text-amber-600">{formatCurrency(course.price)}</p>
                                            {course.instructor && (
                                                <p className="text-[11px] sm:text-xs text-gray-400 flex items-center gap-1 mt-0.5 sm:mt-1">
                                                    <FontAwesomeIcon icon={faUserGraduate} className="text-[10px]" />
                                                    {course.instructor}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs sm:text-sm text-amber-500 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-medium">
                                            Xem thêm <FontAwesomeIcon icon={faArrowRight} className="text-[10px] sm:text-xs" />
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
