import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser, faNewspaper, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { API } from "../../api/axiosClient";
import { getOptimizedImage } from "../../helpers/format";

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
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Đang tải...
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
                <FontAwesomeIcon icon={faNewspaper} className="text-5xl mb-4" />
                <p className="text-lg">Bài viết không tồn tại</p>
                <Link to="/blog" className="mt-4 text-amber-600 hover:underline">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <nav className="text-sm mb-8">
                    <ol className="flex items-center gap-2 text-gray-500">
                        <li><Link to="/" className="hover:text-amber-600">Trang chủ</Link></li>
                        <li>/</li>
                        <li><Link to="/blog" className="hover:text-amber-600">Bài viết</Link></li>
                        <li>/</li>
                        <li className="text-gray-800 font-medium line-clamp-1">{blog.title}</li>
                    </ol>
                </nav>

                <Link to="/blog" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-8">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Quay lại
                </Link>

                {blog.images?.length > 0 && (
                    <div className="rounded-xl overflow-hidden mb-8">
                        <img
                            src={getOptimizedImage(blog.images[0], 800)}
                            alt={blog.title}
                            loading="eager"
                            decoding="async"
                            className="w-full h-80 object-cover"
                        />
                    </div>
                )}

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {blog.title}
                </h1>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUser} />
                        <span>{blog.author?.name || "Không xác định"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendar} />
                        <span>{blog.createdAt ? formatDate(blog.createdAt) : "-"}</span>
                    </div>
                </div>

                {blog.excerpt && (
                    <p className="text-lg text-gray-600 italic mb-6 border-l-4 border-amber-400 pl-4">
                        {blog.excerpt}
                    </p>
                )}

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {blog.content}
                </div>
            </div>
        </div>
    );
}
