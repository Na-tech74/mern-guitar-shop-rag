import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faImage, faTimes } from "@fortawesome/free-solid-svg-icons";
import { API } from "../../../api/axiosClient.js";
import useBlog from "../hooks/useBlog";

export default function Blog() {
    const { blogs, loading, createBlog, updateBlog, deleteBlog, uploadBanner } = useBlog();
    const [showForm, setShowForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({ title: "", content: "", excerpt: "" });
    const [bannerUrl, setBannerUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const bannerInputRef = useRef(null);
    const fileInputRef = useRef(null);

    const uploadToServer = async (file) => {
        try {
            const token = localStorage.getItem("token");
            
            if (!token) {
                throw new Error("Chưa đăng nhập! Vui lòng đăng nhập lại.");
            }
            
            const formDataUpload = new FormData();
            formDataUpload.append("banner", file);
            const res = await fetch("http://localhost:5000/api/blogs/upload-banner", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formDataUpload
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || `Upload failed: ${res.status}`);
            }
            return data.data.banner;
        } catch (err) {
            throw err;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let blogData = { ...formData };
            
            if (!editingBlog && bannerUrl) {
                blogData.banner = bannerUrl;
            }
            
            if (editingBlog) {
                await updateBlog(editingBlog._id, blogData);
            } else {
                await createBlog(blogData);
            }
            setShowForm(false);
            setEditingBlog(null);
            setFormData({ title: "", content: "", excerpt: "" });
            setBannerUrl("");
        } catch (error) {
            alert("Có lỗi xảy ra!");
        }
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({ title: blog.title, content: blog.content, excerpt: blog.excerpt || "" });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa bài viết này?")) {
            await deleteBlog(id);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            if (editingBlog) {
                const formDataUpload = new FormData();
                formDataUpload.append("banner", file);
                await API.post(`/blogs/${editingBlog._id}/banner`, formDataUpload, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                window.location.reload();
            } else {
                const url = await uploadToServer(file);
                setBannerUrl(url);
            }
        } catch (err) {
            alert("Upload failed: " + (err.response?.data?.message || err.message));
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Đang tải...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Blog</h1>
                    <p className="text-gray-500">Quản lý bài viết và banner</p>
                </div>
                <button
                    onClick={() => { setShowForm(true); setEditingBlog(null); setFormData({ title: "", content: "", excerpt: "" }); setBannerUrl(""); }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm bài viết
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">
                                {editingBlog ? "Sửa bài viết" : "Thêm bài viết mới"}
                            </h2>
                            <button onClick={() => { setShowForm(false); setBannerUrl(""); }} className="text-gray-500 hover:text-gray-700">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                                    rows={8}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner</label>
                                {editingBlog ? (
                                    <div className="space-y-2">
                                        {editingBlog.banner && (
                                            <img src={editingBlog.banner} alt="Banner" className="w-full h-40 object-cover rounded-lg" />
                                        )}
                                        <input
                                            type="file"
                                            ref={bannerInputRef}
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => bannerInputRef.current?.click()}
                                            disabled={uploading}
                                            className="px-4 py-2 border border-amber-500 text-amber-600 rounded-lg hover:bg-amber-50 disabled:opacity-50"
                                        >
                                            <FontAwesomeIcon icon={faImage} className="mr-2" />
                                            {uploading ? "Đang tải..." : "Đổi banner"}
                                        </button>
                                    </div>
                                ) : bannerUrl ? (
                                    <div className="relative inline-block">
                                        <img src={bannerUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => setBannerUrl("")}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="text-xs" />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                            className="hidden"
                                        />
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-400"
                                        >
                                            <FontAwesomeIcon icon={faImage} className="text-3xl text-gray-400 mb-2" />
                                            <p className="text-gray-500">{uploading ? "Đang tải..." : "Click để chọn banner"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                                >
                                    {editingBlog ? "Lưu" : "Thêm"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {blogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">Chưa có bài viết nào</div>
                ) : (
                    blogs.map((blog) => (
                        <div key={blog._id} className="flex items-center gap-4 p-4 bg-white border rounded-lg hover:shadow-md">
                            <div className="w-24 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                {blog.banner ? (
                                    <img src={blog.banner} alt={blog.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FontAwesomeIcon icon={faImage} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 truncate">{blog.title}</h3>
                                <p className="text-sm text-gray-500 truncate">{blog.excerpt || "Không có mô tả"}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(blog)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    onClick={() => handleDelete(blog._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}