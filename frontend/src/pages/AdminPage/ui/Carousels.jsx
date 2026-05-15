import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faImage } from "@fortawesome/free-solid-svg-icons";
import { useCarousels } from "../hooks/useCarousels";

export default function Carousels() {
    const { carousels, loading, createCarousel, updateCarousel, deleteCarousel, fetchCarousels } = useCarousels();
    const [showModal, setShowModal] = useState(false);
    const [editingCarousel, setEditingCarousel] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        description: "",
        cta: "Xem thêm",
        path: "/products",
        isActive: true,
        order: 0,
        image: null,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCarousel) {
                await updateCarousel(editingCarousel._id, formData);
            } else {
                await createCarousel(formData);
            }
            setShowModal(false);
            resetForm();
            fetchCarousels();
        } catch (error) {
            console.error("Error saving carousel:", error);
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (carousel) => {
        setEditingCarousel(carousel);
        setFormData({
            title: carousel.title || "",
            subtitle: carousel.subtitle || "",
            description: carousel.description || "",
            cta: carousel.cta || "Xem thêm",
            path: carousel.path || "/products",
            isActive: carousel.isActive,
            order: carousel.order || 0,
            image: null,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa carousel này?")) {
            try {
                await deleteCarousel(id);
            } catch (error) {
                console.error("Error deleting carousel:", error);
            }
        }
    };

    const resetForm = () => {
        setEditingCarousel(null);
        setFormData({
            title: "",
            subtitle: "",
            description: "",
            cta: "Xem thêm",
            path: "/products",
            isActive: true,
            order: 0,
            image: null,
        });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    if (loading) return <div className="p-6">Đang tải...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Carousel</h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg flex items-center gap-2 hover:bg-amber-700"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm Carousel
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thứ tự</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {carousels.map((carousel) => (
                            <tr key={carousel._id}>
                                <td className="px-6 py-4">
                                    <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden">
                                        {carousel.image ? (
                                            <img
                                                src={carousel.image}
                                                alt={carousel.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <FontAwesomeIcon icon={faImage} />
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{carousel.title}</div>
                                    <div className="text-sm text-gray-500">{carousel.subtitle}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{carousel.order}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                            carousel.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {carousel.isActive ? "Hoạt động" : "Không hoạt động"}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(carousel)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(carousel._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {carousels.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    Chưa có carousel nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            {editingCarousel ? "Sửa Carousel" : "Thêm Carousel mới"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tiêu đề *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phụ đề
                                </label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nút bấm (CTA)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.cta}
                                        onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Đường dẫn
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.path}
                                        onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Thứ tự
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div className="flex items-center mt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="w-4 h-4 text-amber-600 rounded"
                                        />
                                        <span className="text-sm text-gray-700">Hoạt động</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {editingCarousel ? "Thay đổi hình ảnh (không bắt buộc)" : "Hình ảnh *"}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required={!editingCarousel}
                                />
                                {editingCarousel && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">Hình hiện tại:</p>
                                        <img
                                            src={editingCarousel.image}
                                            alt="Current"
                                            className="w-32 h-20 object-cover mt-1 rounded"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                                >
                                    {editingCarousel ? "Cập nhật" : "Thêm mới"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}