import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash, faImage, faTrademark, faEye, faEyeSlash, faGlobe, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useBrands } from "./hooks/useBrands";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function Brands() {
    const {
        brands, loading, showModal, setShowModal,
        editingBrand, formData, setFormData,
        logoPreview, handleImageChange,
        handleSubmit, handleEdit, handleDelete,
        resetForm, openModal,
    } = useBrands();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full size-12 border-b-2 border-amber-400"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="size-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faTrademark} className="text-amber-600 text-lg" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý thương hiệu</h1>
                        <p className="text-sm text-gray-500">{brands.length} thương hiệu</p>
                    </div>
                </div>
                <Button onClick={openModal} variant="primary" size="sm" className="shrink-0 shadow-sm">
                    <FontAwesomeIcon icon={faPlus} /> Thêm thương hiệu
                </Button>
            </div>

            <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-50">
                    {brands.length === 0 ? (
                        <div className="py-16 text-center text-gray-400 text-sm">
                            <FontAwesomeIcon icon={faTrademark} className="text-3xl text-gray-200 mb-3 block mx-auto" />
                            Chưa có thương hiệu nào
                        </div>
                    ) : (
                        brands.map((brand) => (
                            <div key={brand._id} className="flex items-center gap-4 pr-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                <div className="size-14 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                                    {brand.logo ? (
                                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                                            <FontAwesomeIcon icon={faImage} className="text-lg" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{brand.name}</h3>
                                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                                        {brand.country && (
                                            <span><FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />{brand.country}</span>
                                        )}
                                        {brand.website && (
                                            <span><FontAwesomeIcon icon={faGlobe} className="mr-1" />{brand.website}</span>
                                        )}
                                    </div>
                                </div>
                                <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                                    brand.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                                }`}>
                                    <FontAwesomeIcon icon={brand.isActive ? faEye : faEyeSlash} className="text-[10px]" />
                                    {brand.isActive ? "Hoạt động" : "Ẩn"}
                                </span>
                                <button onClick={() => handleEdit(brand)} className="size-9 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center transition-colors">
                                    <FontAwesomeIcon icon={faPen} className="text-sm" />
                                </button>
                                <button onClick={() => handleDelete(brand._id)} className="size-9 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors">
                                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between px-6 pt-6 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faTrademark} className="text-amber-600 text-sm" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {editingBrand ? "Cập nhật thương hiệu" : "Thêm thương hiệu"}
                                </h2>
                            </div>
                            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="size-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors">
                                <span className="text-lg leading-none">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Logo thương hiệu</label>
                                <div className="flex items-center gap-4">
                                    <div className="size-20 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <FontAwesomeIcon icon={faImage} className="text-gray-300 text-2xl" />
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="brand-logo"
                                        />
                                        <label
                                            htmlFor="brand-logo"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 text-sm cursor-pointer transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faImage} />
                                            Chọn logo
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <Input
                                label="Tên thương hiệu"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Mô tả"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="Quốc gia"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                                <Input
                                    label="Website"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="brand-isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="rounded border-gray-300 text-amber-400 focus:ring-amber-400"
                                />
                                <label htmlFor="brand-isActive" className="text-sm text-gray-700">Hoạt động</label>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                                <Button variant="secondary" type="button" onClick={() => { setShowModal(false); resetForm(); }} className="w-full sm:w-auto">
                                    Hủy
                                </Button>
                                <Button type="submit" variant="primary" className="w-full sm:w-auto shadow-sm">
                                    {editingBrand ? "Cập nhật" : "Thêm mới"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
