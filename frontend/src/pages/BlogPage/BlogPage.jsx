import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser, faNewspaper, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { API } from "../../api/axiosClient";
import { getOptimizedImage } from "../../helpers/format";

export default function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/blogs")
            .then((res) => setBlogs(res.data?.data?.blogs || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
        });

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium">Bài viết</li>
                    </ol>
                </nav>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Blogs Guitar</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Những kiến thức, chia sẻ và tin tức mới nhất về nhạc cụ
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Đang tải...</div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <FontAwesomeIcon icon={faNewspaper} className="text-5xl mb-4" />
                        <p>Chưa có bài viết nào</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <Link
                                key={blog._id}
                                to={`/blog/${blog._id}`}
                                className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className="h-48 bg-gray-100 overflow-hidden">
                                    {blog.images ? (
                                        <img
                                            src={getOptimizedImage(blog.images, 600)}
                                            alt={blog.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <FontAwesomeIcon icon={faNewspaper} className="text-4xl" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition">
                                        {blog.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                        {blog.excerpt || "Không có mô tả"}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faUser} />
                                            <span>{blog.author?.name || "Không xác định"}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faCalendar} />
                                            <span>{blog.createdAt ? formatDate(blog.createdAt) : "-"}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1 text-amber-600 text-sm font-medium">
                                        <span>Đọc thêm</span>
                                        <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
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
