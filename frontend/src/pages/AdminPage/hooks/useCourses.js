import { useState, useEffect, useCallback } from "react";
import { courseAPI, categoryAPI } from "../api/adminAPI";

export default function useCourses() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [coursesRes, catRes] = await Promise.all([
                courseAPI.getAll(),
                categoryAPI.getAll().catch(() => ({ data: { data: { categories: [] } } }))
            ]);
            setCourses(coursesRes.data?.data?.courses || []);
            setCategories(catRes.data?.data?.categories || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

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
            await fetchCourses();
            resetForm();
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Có lỗi xảy ra!";
            alert(msg);
        }
    };

    const handleEdit = (course) => {
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
        if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) return;
        try {
            await courseAPI.delete(id);
            await fetchCourses();
        } catch (error) {
            alert(error.response?.data?.message || "Xóa thất bại!");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const resetForm = () => {
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
        courses, categories, loading, error,
        showForm, editingCourse, formData, setFormData,
        thumbnailPreview, thumbnailFile,
        handleSubmit, handleEdit, handleDelete, handleFileChange,
        handleLessonChange, addLesson, removeLesson,
        resetForm, openForm, fetchCourses,
    };
}
