import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faUserGraduate, faClock, faImage, faPlay, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { courseAPI } from "../AdminPage/api/adminAPI";
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
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Khóa học</li>
                    </ol>
                </nav>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full size-12 border-b-2 border-amber-600" />
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                        <div className="size-20 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faVideo} className="text-3xl text-amber-300" />
                        </div>
                        <p className="text-gray-500 text-lg mb-2">Chưa có khóa học nào</p>
                        <p className="text-gray-400 text-sm mb-6">Các khóa học sẽ được cập nhật sớm</p>
                        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition font-medium">
                            Khám phá sản phẩm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Link key={course._id} to={`/courses/${course.slug}`}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300"
                            >
                                <div className="h-48 bg-gray-100 overflow-hidden relative">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} loading="lazy" decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FontAwesomeIcon icon={faImage} className="text-4xl" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white text-xs">
                                        <span className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faVideo} />
                                            {course.lessons?.length || 0} bài học
                                        </span>
                                        {course.lessons?.length > 0 && course.lessons[0]?.duration && (
                                            <span className="flex items-center gap-1">
                                                <FontAwesomeIcon icon={faClock} />
                                                {course.lessons[0].duration}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-5">
                                    {course.category?.name && (
                                        <p className="text-xs text-amber-600 font-medium mb-1">{course.category.name}</p>
                                    )}
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{course.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-amber-600">{formatCurrency(course.price)}</p>
                                            {course.instructor && (
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <FontAwesomeIcon icon={faUserGraduate} />
                                                    {course.instructor}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-sm text-amber-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
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
