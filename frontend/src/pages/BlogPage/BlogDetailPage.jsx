import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser, faNewspaper, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { API } from "../../api";
import { getOptimizedImage } from "../../helpers/image";

export default function BlogDetailPage() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/blogs/${id}`)
            .then((res) => setBlog(res.data?.data?.blog))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [id]);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit", month: "2-digit", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full size-12 border-b-2 border-amber-400" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="size-20 rounded-2xl bg-amber-50 flex items-center justify-center mb-5">
                    <FontAwesomeIcon icon={faNewspaper} className="text-4xl text-amber-400" />
                </div>
                <p className="text-gray-600 text-lg font-medium mb-2">Bài viết không tồn tại</p>
                <p className="text-gray-400 text-sm mb-6">Có thể bài viết đã bị xoá hoặc đường dẫn không đúng</p>
                <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-white rounded-full font-medium transition shadow-sm">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-400">
                        <li><Link to="/" className="hover:text-amber-500 transition">Trang chủ</Link></li>
                        <li className="text-gray-300">/</li>
                        <li><Link to="/blog" className="hover:text-amber-500 transition">Bài viết</Link></li>
                        <li className="text-gray-300">/</li>
                        <li className="text-gray-600 font-medium line-clamp-1">{blog.title}</li>
                    </ol>
                </nav>

                <Link to="/blog" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-600 font-medium mb-8 transition">
                    <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
                    Quay lại
                </Link>

                {blog.images?.length > 0 && (
                    <div className="rounded-2xl overflow-hidden mb-8 shadow-soft">
                        <img
                            src={getOptimizedImage(blog.images[0], 800)}
                            alt={blog.title}
                            loading="eager"
                            decoding="async"
                            className="w-full h-80 object-cover"
                        />
                    </div>
                )}

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {blog.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
                    <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faUser} className="text-xs" />
                        {blog.author?.name || "Không xác định"}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faCalendar} className="text-xs" />
                        {blog.createdAt ? formatDate(blog.createdAt) : "-"}
                    </span>
                </div>

                {blog.excerpt && (
                    <p className="text-lg text-gray-500 italic mb-6 border-l-4 border-amber-400 pl-4 leading-relaxed">
                        {blog.excerpt}
                    </p>
                )}

                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {blog.content}
                </div>
            </div>
        </div>
    );
}
