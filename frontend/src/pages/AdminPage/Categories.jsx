import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash, faSearch, faImage, faSpinner, faTags, faEye, faEyeSlash, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../helpers/formatters";
import { useCategories } from "./hooks/useCategories";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function Categories() {
    const { 
        loading, refetching, filteredCategories, searchTerm, setSearchTerm,
        handleSubmit, handleDelete, handleEdit, resetForm, openModal,
        showModal, setShowModal, editingCategory,
        formData, setFormData, imagePreview, handleImageChange, categories
    } = useCategories();

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
                        <FontAwesomeIcon icon={faTags} className="text-amber-600 text-sm sm:text-lg" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Quản lý danh mục</h1>
                        <p className="text-[10px] sm:text-sm text-gray-500">{categories.length} danh mục</p>
                    </div>
                </div>
                <Button onClick={openModal} variant="primary" size="sm" className="shrink-0 shadow-sm">
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm danh mục
                </Button>
            </div>

            <div className="rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-10 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
                        />
                        {refetching && (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 animate-spin"
                            />
                        )}
                    </div>
                </div>

                <div className="p-2 sm:p-4">
                    {filteredCategories.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">
                            Không tìm thấy danh mục nào
                        </div>
                    ) : (
                        <div className="grid gap-2 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredCategories.map((category) => (
                                <div key={category._id} className="rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow">
                                    <div className="p-3 sm:p-4">
                                        <div className="flex gap-3 sm:gap-4">
                                            <div className="size-14 sm:size-20 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                                                {category.image ? (
                                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                        <FontAwesomeIcon icon={faImage} className="text-lg sm:text-2xl" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-1">
                                                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{category.name}</h3>
                                                    <div className="flex gap-0.5 shrink-0 ml-1">
                                                        <button onClick={() => handleEdit(category)} className="size-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center">
                                                            <FontAwesomeIcon icon={faPen} className="text-[11px]" />
                                                        </button>
                                                        <button onClick={() => handleDelete(category._id)} className="size-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center">
                                                            <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="mt-0.5 text-xs sm:text-sm text-gray-500 line-clamp-2">
                                                    {category.description || "Chưa có mô tả"}
                                                </p>
                                                <p className="mt-1 text-[10px] sm:text-xs text-gray-400 font-mono">
                                                    /{category.slug}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:mt-3 flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-50">
                                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium ${
                                                category.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                                            }`}>
                                                <FontAwesomeIcon icon={category.isActive ? faEye : faEyeSlash} className="text-[8px] sm:text-[10px]" />
                                                {category.isActive ? "Hoạt động" : "Ẩn"}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
                                                <FontAwesomeIcon icon={faCalendar} className="text-[8px] sm:text-[10px]" />
                                                {category.createdAt ? formatDate(category.createdAt) : "-"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faTags} className="text-amber-600 text-sm" />
                                </div>
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                    {editingCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
                                </h2>
                            </div>
                            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="size-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors">
                                <span className="text-lg leading-none">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Hình ảnh</label>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="size-16 sm:size-20 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <FontAwesomeIcon icon={faImage} className="text-gray-300 text-xl sm:text-2xl" />
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="category-image"
                                        />
                                        <label
                                            htmlFor="category-image"
                                            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 text-xs sm:text-sm cursor-pointer transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faImage} />
                                            Chọn ảnh
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <Input
                                label="Tên danh mục"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
                                    rows={3}
                                />
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                                <Button variant="secondary" type="button" onClick={() => { setShowModal(false); resetForm(); }} className="w-full sm:w-auto">
                                    Hủy
                                </Button>
                                <Button type="submit" variant="primary" className="w-full sm:w-auto shadow-sm">
                                    {editingCategory ? "Cập nhật" : "Thêm mới"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
