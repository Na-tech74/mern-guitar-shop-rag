import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash, faImage, faEye, faEyeSlash, faVideo, faGripVertical, faChevronDown, faChevronUp, faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, formatDateTime } from "../../helpers/formatters";
import useCourses from "./hooks/useCourses";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState } from "react";

export default function Courses() {
    const {
        courses, categories, loading, error, showForm, editingCourse,
        formData, setFormData, thumbnailPreview, thumbnailFile,
        handleSubmit, handleEdit, handleDelete, handleFileChange,
        handleLessonChange, addLesson, removeLesson,
        resetForm, openForm, fetchCourses
    } = useCourses();

    const [expandedLessons, setExpandedLessons] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full size-10 sm:size-12 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBookOpen} className="text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quản lý khóa học</h1>
                        <p className="text-xs sm:text-sm text-gray-500">Quản lý danh sách khóa học ({courses.length})</p>
                    </div>
                </div>
                <div className="rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
                    <p className="mb-4 text-red-500">{error}</p>
                    <Button variant="outline" onClick={fetchCourses}>Thử lại</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="size-9 sm:size-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faBookOpen} className="text-amber-600 text-sm sm:text-lg" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Quản lý khóa học</h1>
                        <p className="text-[10px] sm:text-sm text-gray-500">{courses.length} khóa học</p>
                    </div>
                </div>
                <Button onClick={openForm} variant="primary" size="sm" className="shrink-0 shadow-sm">
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm khóa học
                </Button>
            </div>

            {courses.length === 0 ? (
                <div className="rounded-xl bg-white p-12 text-center shadow-sm border border-gray-100">
                    <div className="size-12 sm:size-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faBookOpen} className="text-xl sm:text-2xl text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Chưa có khóa học nào</p>
                </div>
            ) : (
                <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Khóa học</th>
                                    <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Giá</th>
                                    <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Bài học</th>
                                    <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Trạng thái</th>
                                    <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Ngày tạo</th>
                                    <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course, i) => (
                                    <tr key={course._id} className={`border-b border-gray-50 last:border-0 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faImage} className="text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-800 text-sm truncate max-w-[200px]">{course.title}</p>
                                                    <p className="text-xs text-gray-500">{course.instructor}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-gray-800 text-sm">{formatCurrency(course.price)}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{course.lessons?.length || 0}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${course.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                                                <FontAwesomeIcon icon={course.isPublished ? faEye : faEyeSlash} className="text-[10px]" />
                                                {course.isPublished ? "Đã đăng" : "Nháp"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{formatDateTime(course.createdAt)}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => handleEdit(course)} className="size-8 rounded-lg hover:bg-blue-50 text-blue-600 transition-all flex items-center justify-center" title="Sửa">
                                                    <FontAwesomeIcon icon={faPen} className="text-xs" />
                                                </button>
                                                <button onClick={() => handleDelete(course._id)} className="size-8 rounded-lg hover:bg-red-50 text-red-500 transition-all flex items-center justify-center" title="Xóa">
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
                        {courses.map((course) => (
                            <div key={course._id} className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                                <div className="p-3">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="size-12 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
                                                {course.thumbnail ? (
                                                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                                                ) : (
                                                    <FontAwesomeIcon icon={faImage} className="text-gray-200" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{course.title}</p>
                                                <p className="text-[11px] text-gray-500">{course.instructor}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5 shrink-0">
                                            <button onClick={() => handleEdit(course)} className="size-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faPen} className="text-[11px]" />
                                            </button>
                                            <button onClick={() => handleDelete(course._id)} className="size-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${course.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                                            <FontAwesomeIcon icon={course.isPublished ? faEye : faEyeSlash} className="text-[7px]" />
                                            {course.isPublished ? "Đã đăng" : "Nháp"}
                                        </span>
                                        <span className="text-[10px] text-gray-500">{course.lessons?.length || 0} bài học</span>
                                        <span className="text-[10px] text-gray-400">{formatCurrency(course.price)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto" onClick={resetForm}>
                    <div className="w-full sm:max-w-3xl rounded-t-xl sm:rounded-xl bg-white shadow-xl my-0 sm:my-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-xl z-10">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="size-8 sm:size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faBookOpen} className="text-amber-600 text-xs sm:text-sm" />
                                </div>
                                <h2 className="text-sm sm:text-lg font-semibold text-gray-800">
                                    {editingCourse ? "Cập nhật khóa học" : "Thêm khóa học"}
                                </h2>
                            </div>
                            <button type="button" onClick={resetForm} className="size-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors">
                                <span className="text-lg leading-none">&times;</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div className="md:col-span-2">
                                    <Input label="Tên khóa học" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 bg-gray-50 rounded-lg outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition resize-none"
                                        required
                                    />
                                </div>
                                <Input label="Giá (VND)" type="number" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} required />
                                <Input label="Giảng viên" value={formData.instructor} onChange={e => setFormData(prev => ({ ...prev, instructor: e.target.value }))} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-gray-50 rounded-lg outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end pb-2.5">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isPublished}
                                            onChange={e => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                            className="size-4 text-amber-500 focus:ring-amber-500/50 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Xuất bản</span>
                                    </label>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh thumbnail</label>
                                    <div className="flex items-center gap-3">
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer" />
                                        {thumbnailPreview && (
                                            <img src={thumbnailPreview} alt="" className="size-14 sm:size-20 object-cover rounded-lg border border-gray-100" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 sm:pt-6">
                                <div className="flex items-center justify-between mb-3 sm:mb-4">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
                                        <FontAwesomeIcon icon={faVideo} className="text-gray-500 text-xs sm:text-sm" />
                                        Bài học ({formData.lessons.length})
                                    </h3>
                                    <div className="flex gap-1 sm:gap-2">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setExpandedLessons(!expandedLessons)}>
                                            <FontAwesomeIcon icon={expandedLessons ? faChevronUp : faChevronDown} className="text-xs" />
                                            <span className="hidden sm:inline">{expandedLessons ? "Thu gọn" : "Mở rộng"}</span>
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" onClick={addLesson}>
                                            <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                            <span className="hidden sm:inline">Thêm bài học</span>
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                    {formData.lessons.map((lesson, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-xl p-3 sm:p-4">
                                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                                                <span className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                                                    <FontAwesomeIcon icon={faGripVertical} className="text-gray-400 text-xs" />
                                                    Bài {idx + 1}
                                                </span>
                                                <button type="button" onClick={() => removeLesson(idx)} className="text-red-400 hover:text-red-600 transition-colors">
                                                    <FontAwesomeIcon icon={faTrash} className="text-xs sm:text-sm" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                                <Input
                                                    label="Tiêu đề"
                                                    value={lesson.title}
                                                    onChange={e => handleLessonChange(idx, "title", e.target.value)}
                                                    placeholder="Nhập tiêu đề bài học"
                                                />
                                                <Input
                                                    label="Video URL (YouTube)"
                                                    value={lesson.videoUrl}
                                                    onChange={e => handleLessonChange(idx, "videoUrl", e.target.value)}
                                                    placeholder="https://youtube.com/embed/..."
                                                />
                                                <Input
                                                    label="Thời lượng"
                                                    value={lesson.duration}
                                                    onChange={e => handleLessonChange(idx, "duration", e.target.value)}
                                                    placeholder="VD: 15:30"
                                                />
                                                <div className="sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                                                    <textarea
                                                        value={lesson.content}
                                                        onChange={e => handleLessonChange(idx, "content", e.target.value)}
                                                        rows={2}
                                                        placeholder="Nhập nội dung bài học..."
                                                        className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 rounded-lg outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
                                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">Hủy</Button>
                                <Button type="submit" variant="primary" className="w-full sm:w-auto shadow-sm">
                                    {editingCourse ? "Cập nhật" : "Tạo khóa học"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
