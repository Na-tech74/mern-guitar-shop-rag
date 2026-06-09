import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPen, faImage, faTimes, faNewspaper, faSearch, faUser, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { formatDateTime } from "../../helpers/formatters";
import useBlog from "./hooks/useBlog";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState } from "react";

export default function Blog() {
    const { blogs, loading, error, setError, showForm, editingBlog, formData, setFormData, bannerPreview, setBannerFile, setBannerPreview, handleSubmit, handleEdit, handleDelete, handleFileChange, resetForm, openForm } = useBlog();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredBlogs = blogs.filter(b =>
        !searchTerm || b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full size-10 sm:size-12 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="size-9 sm:size-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faNewspaper} className="text-amber-600 text-sm sm:text-lg" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Quản lý Blog</h1>
                        <p className="text-[10px] sm:text-sm text-gray-500">{blogs.length} bài viết</p>
                    </div>
                </div>
                <Button onClick={openForm} variant="primary" size="sm" className="shrink-0 shadow-sm">
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm bài viết
                </Button>
            </div>

            {error && (
                <div className="flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <span className="text-sm text-red-700">{error}</span>
                    <button type="button" onClick={() => setError(null)} className="size-7 rounded-md hover:bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faTimes} className="text-xs" />
                    </button>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl z-10">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="size-8 sm:size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faNewspaper} className="text-amber-600 text-xs sm:text-sm" />
                                </div>
                                <h2 className="text-sm sm:text-lg font-semibold text-gray-800">
                                    {editingBlog ? "Sửa bài viết" : "Thêm bài viết"}
                                </h2>
                            </div>
                            <button type="button" onClick={resetForm} className="size-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors">
                                <span className="text-lg leading-none">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                            <Input
                                label="Tiêu đề"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả ngắn</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nội dung <span className="text-red-500">*</span></label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition"
                                    rows={6}
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Hình ảnh</label>
                                {bannerPreview ? (
                                    <div className="relative w-full rounded-lg overflow-hidden border border-gray-100">
                                        <img src={bannerPreview} alt="Banner" className="w-full h-32 sm:h-40 object-cover" />
                                        <button type="button" onClick={() => { setBannerFile(null); setBannerPreview(""); }} className="absolute top-2 right-2 size-7 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center shadow-sm">
                                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center h-28 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all">
                                        <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                                        <FontAwesomeIcon icon={faImage} className="text-gray-300 text-xl mb-1" />
                                        <p className="text-xs text-gray-500">Nhấn để chọn hình ảnh</p>
                                    </label>
                                )}
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">Hủy</Button>
                                <Button type="submit" variant="primary" className="w-full sm:w-auto shadow-sm">
                                    {editingBlog ? "Lưu" : "Thêm"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-10 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
                        />
                    </div>
                </div>

                {blogs.length === 0 ? (
                    <div className="py-12 sm:py-16 text-center">
                        <div className="size-12 sm:size-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faNewspaper} className="text-xl sm:text-2xl text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">Chưa có bài viết nào</p>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-sm">
                        Không tìm thấy bài viết nào
                    </div>
                ) : (
                    <>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Ảnh</th>
                                        <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Tiêu đề</th>
                                        <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Tác giả</th>
                                        <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Ngày tạo</th>
                                        <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBlogs.map((blog, i) => (
                                        <tr key={blog._id} className={`border-b border-gray-50 last:border-0 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                                            <td className="py-3 px-4">
                                                <div className="size-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                    {blog.images?.length > 0 ? (
                                                        <img src={blog.images[0]} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <FontAwesomeIcon icon={faImage} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-gray-800 text-sm truncate max-w-[250px]">{blog.title}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[250px]">{blog.excerpt || "Không có mô tả"}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-[10px]" />
                                                    {blog.author?.name || "Không xác định"}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                    <FontAwesomeIcon icon={faCalendar} className="text-gray-400 text-[10px]" />
                                                    {blog.createdAt ? formatDateTime(blog.createdAt) : "-"}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => handleEdit(blog)} className="size-8 rounded-lg hover:bg-blue-50 text-blue-600 transition-all flex items-center justify-center" title="Sửa">
                                                        <FontAwesomeIcon icon={faPen} className="text-xs" />
                                                    </button>
                                                    <button onClick={() => handleDelete(blog._id)} className="size-8 rounded-lg hover:bg-red-50 text-red-500 transition-all flex items-center justify-center" title="Xóa">
                                                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden p-2 space-y-2">
                            {filteredBlogs.map((blog) => (
                                <div key={blog._id} className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="p-3">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className="size-12 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                                                    {blog.images?.length > 0 ? (
                                                        <img src={blog.images[0]} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faImage} className="text-gray-200" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{blog.title}</p>
                                                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{blog.excerpt || "Không có mô tả"}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 shrink-0">
                                                <button onClick={() => handleEdit(blog)} className="size-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faPen} className="text-[11px]" />
                                                </button>
                                                <button onClick={() => handleDelete(blog._id)} className="size-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FontAwesomeIcon icon={faUser} className="text-[8px]" />
                                                {blog.author?.name || "Không xác định"}
                                            </span>
                                            <span>·</span>
                                            <span className="flex items-center gap-1">
                                                <FontAwesomeIcon icon={faCalendar} className="text-[8px]" />
                                                {blog.createdAt ? formatDateTime(blog.createdAt) : "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
