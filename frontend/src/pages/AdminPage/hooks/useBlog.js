import { useState, useEffect, useCallback, useRef } from "react";
import { blogAPI } from "../api/adminAPI";
import { useDialog } from "../../../components/ConfirmDialog";

export default function useBlog() {
    const { confirm, alert } = useDialog();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refetching, setRefetching] = useState(false);
    const [error, setError] = useState(null);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({ title: "", content: "", excerpt: "" });
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreviewState] = useState("");

    // Theo dõi blob URL hiện tại của banner để revoke đúng lúc.
    const bannerBlobRef = useRef(null);
    const hasLoadedRef = useRef(false);

    /**
     * Setter wrapper: revoke blob cũ khi đổi preview hoặc clear.
     */
    const setBannerPreview = useCallback((val) => {
        // Nếu giá trị mới khác blob hiện tại, revoke blob cũ.
        if (bannerBlobRef.current && bannerBlobRef.current !== val) {
            URL.revokeObjectURL(bannerBlobRef.current);
            bannerBlobRef.current = null;
        }
        setBannerPreviewState(val);
    }, []);

    const fetchBlogs = useCallback(async ({ silent = false } = {}) => {
        if (silent && hasLoadedRef.current) {
            setRefetching(true);
        } else {
            setLoading(true);
        }
        setError(null);
        try {
            const res = await blogAPI.getAll();
            setBlogs(res.data?.data?.blogs || []);
            hasLoadedRef.current = true;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
            setRefetching(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && hasLoadedRef.current) {
                fetchBlogs({ silent: true });
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [fetchBlogs]);

    // Cleanup blob khi unmount.
    useEffect(() => {
        return () => {
            if (bannerBlobRef.current) {
                URL.revokeObjectURL(bannerBlobRef.current);
                bannerBlobRef.current = null;
            }
        };
    }, []);

    const createBlog = async (data) => {
        try {
            const res = await blogAPI.create(data);
            setBlogs(prev => [res.data.data.newBlogs, ...prev]);
            setError(null);
            return res.data.data.newBlogs;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const updateBlog = async (id, data) => {
        try {
            const res = await blogAPI.update(id, data);
            setBlogs(prev => prev.map(b => b._id === id ? res.data.data.blog : b));
            setError(null);
            return res.data.data.blog;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const deleteBlog = async (id) => {
        try {
            await blogAPI.delete(id);
            setBlogs(prev => prev.filter(b => b._id !== id));
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            throw err;
        }
    };

    const uploadBanner = async (blogId, file) => {
        const formData = new FormData();
        formData.append("banner", file);
        try {
            const res = await blogAPI.uploadBanner(blogId, formData);
            setBlogs(prev => prev.map(b => b._id === blogId ? { ...b, banner: res.data?.data?.banner } : b));
            return res.data?.data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const resetForm = () => {
        if (bannerBlobRef.current) {
            URL.revokeObjectURL(bannerBlobRef.current);
            bannerBlobRef.current = null;
        }
        setShowForm(false);
        setEditingBlog(null);
        setFormData({ title: "", content: "", excerpt: "" });
        setBannerFile(null);
        setBannerPreviewState("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append("title", formData.title);
            fd.append("content", formData.content);
            fd.append("excerpt", formData.excerpt);
            if (bannerFile) {
                for (const file of bannerFile) {
                    fd.append("images", file);
                }
            }
            if (editingBlog) {
                await updateBlog(editingBlog._id, fd);
            } else {
                await createBlog(fd);
            }
            resetForm();
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Có lỗi xảy ra!";
            setError(msg);
            alert({ title: "Lỗi", message: msg, variant: "error" });
        }
    };

    const handleEdit = (blog) => {
        if (bannerBlobRef.current) {
            URL.revokeObjectURL(bannerBlobRef.current);
            bannerBlobRef.current = null;
        }
        setEditingBlog(blog);
        setFormData({ title: blog.title, content: blog.content, excerpt: blog.excerpt || "" });
        setBannerPreviewState(blog.images?.[0] || "");
        setBannerFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "Xóa bài viết",
            message: "Bạn có chắc muốn xóa bài viết này?",
            confirmText: "Xóa",
            variant: "danger",
        });
        if (ok) {
            await deleteBlog(id);
        }
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        // Revoke blob cũ trước khi tạo blob mới.
        if (bannerBlobRef.current) {
            URL.revokeObjectURL(bannerBlobRef.current);
        }
        const url = URL.createObjectURL(files[0]);
        bannerBlobRef.current = url;
        setBannerFile(files);
        setBannerPreviewState(url);
    };

    const openForm = () => {
        resetForm();
        setShowForm(true);
    };

    return {
        blogs,
        loading,
        refetching,
        error,
        setError,
        selectedBlog,
        setSelectedBlog,
        fetchBlogs,
        createBlog,
        updateBlog,
        deleteBlog,
        uploadBanner,
        showForm,
        editingBlog,
        formData,
        setFormData,
        bannerPreview,
        setBannerPreview,
        bannerFile,
        setBannerFile,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleFileChange,
        resetForm,
        openForm,
    };
}
