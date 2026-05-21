import { useState, useEffect, useCallback } from "react";
import { blogAPI } from "../api/adminAPI";

export default function useBlog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedBlog, setSelectedBlog] = useState(null);

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await blogAPI.getAll();
            setBlogs(res.data?.data?.blogs || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                fetchBlogs();
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [fetchBlogs]);

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

    return {
        blogs,
        loading,
        error,
        setError,
        selectedBlog,
        setSelectedBlog,
        fetchBlogs,
        createBlog,
        updateBlog,
        deleteBlog,
        uploadBanner
    };
}