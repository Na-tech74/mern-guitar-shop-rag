import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faImage, faTimes, faCalendar, faUser } from "@fortawesome/free-solid-svg-icons";
import { formatDateTime } from "../../../helpers/format";
import useBlog from "../hooks/useBlog";

export default function Blog() {
    const { blogs, loading, error, setError, showForm, editingBlog, formData, setFormData, bannerPreview, setBannerFile, setBannerPreview, handleSubmit, handleEdit, handleDelete, handleFileChange, resetForm, openForm } = useBlog();

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Đang tải...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Blog</h1>
                    <p className="text-gray-500 text-sm">Quản lý bài viết</p>
                </div>
                <button onClick={openForm} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition">
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm bài viết
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                    <button onClick={() => setError(null)} className="float-right text-red-500 hover:text-red-700">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingBlog ? "Sửa bài viết" : "Thêm bài viết mới"}
                            </h2>
                            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 p-1">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                                <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" rows={2} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung <span className="text-red-500">*</span></label>
                                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" rows={8} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                                {bannerPreview ? (
                                    <div className="relative w-full">
                                        <img src={bannerPreview} alt="Banner" className="w-full h-40 object-cover rounded-lg" />
                                        <button type="button" onClick={() => { setBannerFile(null); setBannerPreview(""); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-400 block transition">
                                        <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                                        <FontAwesomeIcon icon={faImage} className="text-3xl text-gray-400 mb-2" />
                                        <p className="text-gray-500">Click để chọn hình ảnh</p>
                                    </label>
                                )}
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                                <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition">
                                    {editingBlog ? "Lưu" : "Thêm"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {blogs.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-300 mb-3" />
                        <p>Chưa có bài viết nào</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left px-4 py-3 text-xs font-medium uppercase text-gray-500 w-16">Ảnh</th>
                                <th className="text-left px-4 py-3 text-xs font-medium uppercase text-gray-500">Tiêu đề</th>
                                <th className="text-left px-4 py-3 text-xs font-medium uppercase text-gray-500 hidden md:table-cell">Mô tả</th>
                                <th className="text-left px-4 py-3 text-xs font-medium uppercase text-gray-500 hidden lg:table-cell">Tác giả</th>
                                <th className="text-left px-4 py-3 text-xs font-medium uppercase text-gray-500 hidden lg:table-cell">Ngày tạo</th>
                                <th className="text-right px-4 py-3 text-xs font-medium uppercase text-gray-500 w-24">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <div className="w-14 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                            {blog.images?.length > 0 ? (
                                                <img src={blog.images[0]} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <FontAwesomeIcon icon={faImage} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-gray-800 line-clamp-1">{blog.title}</p>
                                        <p className="text-xs text-gray-400 md:hidden mt-0.5">{blog.excerpt ? blog.excerpt.slice(0, 40) + "..." : "Không có mô tả"}</p>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <p className="text-sm text-gray-500 line-clamp-2">{blog.excerpt || "Không có mô tả"}</p>
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xs" />
                                            {blog.author?.name || "Không xác định"}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <FontAwesomeIcon icon={faCalendar} className="text-gray-400 text-xs" />
                                            {blog.createdAt ? formatDateTime(blog.createdAt) : "-"}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => handleEdit(blog)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Sửa">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button onClick={() => handleDelete(blog._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Xóa">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
