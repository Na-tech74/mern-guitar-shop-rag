import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser, faNewspaper, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { API } from "../../api";
import { getOptimizedImage } from "../../helpers/image";
import { formatDate } from "../../helpers/formatters";
import Breadcrumb from "../../components/Breadcrumb";
export default function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/blogs")
            .then((res) => setBlogs(res.data?.data?.blogs || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []); 

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Bài viết" }]} />

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Blogs Guitar</h1>
                    <div className="w-16 h-1 bg-amber-400 rounded-full mx-auto mb-3" />
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Những kiến thức, chia sẻ và tin tức mới nhất về nhạc cụ
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full size-12 border-b-2 border-amber-400" />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="size-20 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5">
                            <FontAwesomeIcon icon={faNewspaper} className="text-4xl text-amber-400" />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">Chưa có bài viết nào</p>
                        <p className="text-gray-400 text-sm mt-1">Các bài viết sẽ được cập nhật sớm</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <Link
                                key={blog._id}
                                to={`/blog/${blog._id}`}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-pop hover:border-amber-200 transition-all duration-300"
                            >
                                <div className="h-48 bg-gray-100 overflow-hidden relative">
                                    {blog.images?.length > 0 ? (
                                        <img
                                            src={getOptimizedImage(blog.images[0], 600)}
                                            alt={blog.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <FontAwesomeIcon icon={faNewspaper} className="text-4xl" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-snug group-hover:text-amber-500 transition">
                                        {blog.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                                        {blog.excerpt || "Không có mô tả"}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span className="flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faUser} className="text-[10px]" />
                                            {blog.author?.name || "Không xác định"}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faCalendar} className="text-[10px]" />
                                            {blog.createdAt ? formatDate(blog.createdAt) : "-"}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1 text-amber-500 text-sm font-medium">
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
