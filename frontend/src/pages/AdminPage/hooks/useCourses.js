import { useState, useEffect, useCallback, useRef } from "react";
import { courseAPI, categoryAPI } from "../../../api";
import { useDialog } from "../../../components/ConfirmDialog";

export default function useCourses() {
    const { confirm, alert } = useDialog();

    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refetching, setRefetching] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        instructor: "Nam Acoustic",
        category: "",
        isPublished: false,
        lessons: []
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");

    // Theo dõi blob URL của thumbnail để revoke đúng lúc.
    const thumbBlobRef = useRef(null);
    const hasLoadedRef = useRef(false);

    const fetchCourses = useCallback(async ({ silent = false } = {}) => {
        if (silent && hasLoadedRef.current) {
            setRefetching(true);
        } else {
            setLoading(true);
        }
        setError(null);
        try {
            const [coursesRes, catRes] = await Promise.all([
                courseAPI.getAll(),
                categoryAPI.getAll().catch(() => ({ data: { data: { categories: [] } } }))
            ]);
            setCourses(coursesRes.data?.data?.courses || []);
            setCategories(catRes.data?.data?.categories || []);
            hasLoadedRef.current = true;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
            setRefetching(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && hasLoadedRef.current) {
                fetchCourses({ silent: true });
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, [fetchCourses]);

    // Cleanup blob khi unmount.
    useEffect(() => {
        return () => {
            if (thumbBlobRef.current) {
                URL.revokeObjectURL(thumbBlobRef.current);
                thumbBlobRef.current = null;
            }
        };
    }, []);

    const handleLessonChange = (index, field, value) => {
        setFormData(prev => {
            const lessons = [...prev.lessons];
            lessons[index] = { ...lessons[index], [field]: value };
            return { ...prev, lessons };
        });
    };

    const addLesson = () => {
        setFormData(prev => ({
            ...prev,
            lessons: [...prev.lessons, { title: "", videoUrl: "", duration: "", content: "" }]
        }));
    };

    const removeLesson = (index) => {
        setFormData(prev => ({
            ...prev,
            lessons: prev.lessons.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            fd.append("title", formData.title);
            fd.append("description", formData.description);
            fd.append("price", String(formData.price).replace(/\./g, ""));
            fd.append("instructor", formData.instructor);
            fd.append("category", formData.category);
            fd.append("isPublished", formData.isPublished);
            fd.append("lessons", JSON.stringify(formData.lessons));
            if (thumbnailFile) fd.append("thumbnail", thumbnailFile);

            if (editingCourse) {
                await courseAPI.update(editingCourse._id, fd);
            } else {
                await courseAPI.create(fd);
            }
            await fetchCourses({ silent: true });
            resetForm();
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra!";
            alert({ title: "Lỗi", message: msg, variant: "error" });
        }
    };

    const handleEdit = (course) => {
        if (thumbBlobRef.current) {
            URL.revokeObjectURL(thumbBlobRef.current);
            thumbBlobRef.current = null;
        }
        setEditingCourse(course);
        setFormData({
            title: course.title,
            description: course.description,
            price: course.price,
            instructor: course.instructor || "Nam Acoustic",
            category: course.category?._id || course.category || "",
            isPublished: course.isPublished || false,
            lessons: course.lessons || []
        });
        setThumbnailPreview(course.thumbnail || "");
        setThumbnailFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const ok = await confirm({
            title: "Xóa khóa học",
            message: "Bạn có chắc muốn xóa khóa học này?",
            confirmText: "Xóa",
            variant: "danger",
        });
        if (!ok) return;
        try {
            await courseAPI.delete(id);
            await fetchCourses({ silent: true });
        } catch (err) {
            alert({
                title: "Lỗi",
                message: err.response?.data?.message || "Xóa thất bại!",
                variant: "error",
            });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (thumbBlobRef.current) {
            URL.revokeObjectURL(thumbBlobRef.current);
        }
        const url = URL.createObjectURL(file);
        thumbBlobRef.current = url;
        setThumbnailFile(file);
        setThumbnailPreview(url);
    };

    const resetForm = () => {
        if (thumbBlobRef.current) {
            URL.revokeObjectURL(thumbBlobRef.current);
            thumbBlobRef.current = null;
        }
        setShowForm(false);
        setEditingCourse(null);
        setFormData({ title: "", description: "", price: "", instructor: "Nam Acoustic", category: "", isPublished: false, lessons: [] });
        setThumbnailFile(null);
        setThumbnailPreview("");
    };

    const openForm = () => {
        resetForm();
        setShowForm(true);
    };

    return {
        courses, categories, loading, refetching, error,
        showForm, editingCourse, formData, setFormData,
        thumbnailPreview, thumbnailFile,
        handleSubmit, handleEdit, handleDelete, handleFileChange,
        handleLessonChange, addLesson, removeLesson,
        resetForm, openForm, fetchCourses,
    };
}
