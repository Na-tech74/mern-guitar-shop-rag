import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash, faSearch } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../../helpers/format";
import { useCategories } from "../hooks/useCategories";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";

export default function Categories() {
    const { 
        loading, filteredCategories, searchTerm, setSearchTerm,
        handleSubmit, handleDelete, handleEdit, resetForm, openModal,
        showModal, setShowModal, editingCategory, setEditingCategory, 
        formData, setFormData
    } = useCategories();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý danh mục</h1>
                    <p className="text-gray-500">Quản lý danh sách danh mục sản phẩm</p>
                </div>
                <Button onClick={openModal} variant="primary">
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm danh mục
                </Button>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm danh mục..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-amber-500"
                        />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCategories.map((category) => (
                        <div key={category._id} className="rounded-xl border border-gray-200 p-4 transition-all hover:shadow-md">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {category.description || "Chưa có mô tả"}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Slug: {category.slug}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Ngày tạo: {category.createdAt ? formatDate(category.createdAt) : "-"}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(category._id)}>
                                        <FontAwesomeIcon icon={faTrash} className="text-red-600" />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${category.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                    {category.isActive ? "Hoạt động" : "Không hoạt động"}
                                </span>
                            </div>
                        </div>
                    ))}
                    {filteredCategories.length === 0 && (
                        <div className="col-span-full py-8 text-center text-gray-500">
                            Không tìm thấy danh mục nào
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">
                            {editingCategory ? "Cập nhật danh mục" : "Thêm danh mục mới"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="secondary" type="button" onClick={() => { setShowModal(false); resetForm(); }}>
                                    Hủy
                                </Button>
                                <Button type="submit" variant="primary">
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