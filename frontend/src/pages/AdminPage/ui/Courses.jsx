import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash, faImage, faEye, faEyeSlash, faVideo, faGripVertical, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency, formatDateTime } from "../../../helpers/format";
import useCourses from "../hooks/useCourses";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
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
                <div className="animate-spin rounded-full size-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-600">
                Lỗi: {error}
                <Button variant="outline" size="sm" className="ml-4" onClick={fetchCourses}>Thử lại</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý khóa học</h1>
                    <p className="text-gray-500">Quản lý danh sách khóa học ({courses.length})</p>
                </div>
                <Button onClick={openForm} variant="primary">
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm khóa học
                </Button>
            </div>

            {courses.length === 0 ? (
                <div className="rounded-xl bg-white p-8 text-center text-gray-500">
                    Chưa có khóa học nào
                </div>
            ) : (
                <div className="rounded-xl bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="py-3 px-4 text-left text-xs font-medium uppercase text-gray-500">Khóa học</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium uppercase text-gray-500">Giá</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium uppercase text-gray-500">Bài học</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium uppercase text-gray-500">Trạng thái</th>
                                    <th className="py-3 px-4 text-left text-xs font-medium uppercase text-gray-500">Ngày tạo</th>
                                    <th className="py-3 px-4 text-right text-xs font-medium uppercase text-gray-500">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {course.thumbnail ? (
                                                        <img src={course.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faImage} className="text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-800 text-sm truncate">{course.title}</p>
                                                    <p className="text-xs text-gray-500">{course.instructor}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-medium text-gray-800 text-sm">{formatCurrency(course.price)}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{course.lessons?.length || 0}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${course.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                                <FontAwesomeIcon icon={course.isPublished ? faEye : faEyeSlash} className="text-[10px]" />
                                                {course.isPublished ? "Đã đăng" : "Nháp"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">{formatDateTime(course.createdAt)}</td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(course)}>
                                                    <FontAwesomeIcon icon={faPen} className="text-amber-600" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(course._id)}>
                                                    <FontAwesomeIcon icon={faTrash} className="text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto" onClick={() => resetForm()} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); resetForm(); } }} role="button" tabIndex={0}>
                    <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl my-8" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-xl">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {editingCourse ? "Cập nhật khóa học" : "Thêm khóa học mới"}
                            </h2>
                            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Input label="Tên khóa học" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={4}
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-500 transition resize-none"
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
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-500 transition bg-white"
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
                                            className="size-4 text-amber-600 focus:ring-amber-500 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Xuất bản</span>
                                    </label>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh thumbnail</label>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                                    {thumbnailPreview && (
                                        <img src={thumbnailPreview} alt="" className="mt-2 w-32 h-20 object-cover rounded-lg" />
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faVideo} className="text-amber-600" />
                                        Bài học ({formData.lessons.length})
                                    </h3>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setExpandedLessons(!expandedLessons)}>
                                            <FontAwesomeIcon icon={expandedLessons ? faChevronUp : faChevronDown} />
                                            {expandedLessons ? "Thu gọn" : "Mở rộng"}
                                        </Button>
                                        <Button type="button" variant="outline" size="sm" onClick={addLesson}>
                                            <FontAwesomeIcon icon={faPlus} />
                                            Thêm bài học
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {formData.lessons.map((lesson, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faGripVertical} className="text-gray-400" />
                                                    Bài {idx + 1}
                                                </span>
                                                <button type="button" onClick={() => removeLesson(idx)} className="text-red-500 hover:text-red-700 text-sm">
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                                                    <textarea
                                                        value={lesson.content}
                                                        onChange={e => handleLessonChange(idx, "content", e.target.value)}
                                                        rows={2}
                                                        placeholder="Nhập nội dung bài học..."
                                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-amber-500 transition resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <Button type="button" variant="secondary" onClick={resetForm}>Hủy</Button>
                                <Button type="submit" variant="primary">
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
