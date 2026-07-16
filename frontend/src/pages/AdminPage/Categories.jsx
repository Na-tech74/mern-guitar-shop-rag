import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash, faSearch, faImage, faSpinner, faTags, faEye, faEyeSlash, faChevronDown, faFolder, faFile } from "@fortawesome/free-solid-svg-icons";
import { useCategories } from "./hooks/useCategories";
import Button from "../../components/Button";
import Input from "../../components/Input";

function buildTree(categories) {
    const map = {};
    const roots = [];
    categories.forEach((cat) => { map[cat._id] = { ...cat, children: [] }; });
    categories.forEach((cat) => {
        const node = map[cat._id];
        if (cat.parent?._id && map[cat.parent._id]) {
            map[cat.parent._id].children.push(node);
        } else if (!cat.parent) {
            roots.push(node);
        }
    });
    return roots;
}

function CategoryRow({ cat, depth, onEdit, onDelete }) {
    const hasChildren = cat.children && cat.children.length > 0;
    const [expanded, setExpanded] = useState(depth < 1);

    return (
        <>
            <div
                className={`flex items-center gap-2 sm:gap-4 pr-3 sm:pr-6 py-3 sm:py-5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${depth > 0 ? "bg-gray-50/50" : ""}`}
                style={{ paddingLeft: `${depth === 0 ? 20 : 68 + (depth - 1) * 28}px` }}
            >
                {hasChildren ? (
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="size-6 sm:size-7 flex items-center justify-center shrink-0 text-gray-400 hover:text-gray-600 transition rounded hover:bg-gray-100"
                    >
                        <FontAwesomeIcon icon={faChevronDown} className={`text-[10px] sm:text-xs transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`} />
                    </button>
                ) : (
                    <span className="size-6 sm:size-7 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faFile} className="text-[10px] sm:text-sm text-gray-300" />
                    </span>
                )}

                {depth === 0 && (
                <div className="size-10 sm:size-14 rounded-lg sm:rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                    {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <FontAwesomeIcon icon={faImage} className="text-xs sm:text-lg" />
                        </div>
                    )}
                </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                        {hasChildren && <FontAwesomeIcon icon={faFolder} className="text-amber-400 text-[10px] sm:text-sm" />}
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{cat.name}</h3>
                        {hasChildren && (
                            <span className="text-[10px] sm:text-xs text-gray-400 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 font-medium">
                                {cat.children.length}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                    <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        cat.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}>
                        <FontAwesomeIcon icon={cat.isActive ? faEye : faEyeSlash} className="text-[10px]" />
                        {cat.isActive ? "Hoạt động" : "Ẩn"}
                    </span>
                    <button onClick={() => onEdit(cat)} className="size-8 sm:size-9 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center transition-colors">
                        <FontAwesomeIcon icon={faPen} className="text-xs sm:text-sm" />
                    </button>
                    <button onClick={() => onDelete(cat._id)} className="size-8 sm:size-9 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors">
                        <FontAwesomeIcon icon={faTrash} className="text-xs sm:text-sm" />
                    </button>
                </div>
            </div>
            {hasChildren && expanded && cat.children.map((child) => (
                <CategoryRow key={child._id} cat={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </>
    );
}

export default function Categories() {
    const {
        loading, refetching, filteredCategories, searchTerm, setSearchTerm,
        handleSubmit, handleDelete, handleEdit, resetForm, openModal,
        showModal, setShowModal, editingCategory,
        formData, setFormData, imagePreview, handleImageChange, categories
    } = useCategories();

    const parentOptions = categories.filter((cat) => !cat.parent);
    const tree = buildTree(filteredCategories);

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

            <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
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

                <div className="divide-y divide-gray-50">
                    {tree.length === 0 ? (
                        <div className="py-16 text-center text-gray-400 text-sm">
                            <FontAwesomeIcon icon={faTags} className="text-3xl text-gray-200 mb-3 block mx-auto" />
                            Không tìm thấy danh mục nào
                        </div>
                    ) : (
                        tree.map((cat) => (
                            <CategoryRow
                                key={cat._id}
                                cat={cat}
                                depth={0}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
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
                            {!formData.parent && (
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
                            )}
                            <Input
                                label="Tên danh mục"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Danh mục cha</label>
                                <select
                                    value={formData.parent}
                                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
                                >
                                    <option value="">— Không có (danh mục gốc) —</option>
                                    {parentOptions.map((p) => (
                                        <option key={p._id} value={p._id} disabled={editingCategory?._id === p._id}>{p.name}</option>
                                    ))}
                                </select>
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
