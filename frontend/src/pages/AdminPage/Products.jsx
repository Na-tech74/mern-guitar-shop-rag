import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash, faSearch, faImage, faUpload, faSpinner, faBox, faTag, faCube } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../../helpers/formatters";
import { useProducts } from "./hooks/useProducts";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Pagination from "../../components/Pagination";

export default function Products() {
    const {
        loading, refetching, error, filteredProducts, searchTerm, setSearchTerm,
        handleSubmit, handleDelete, handleEdit, resetForm, openModal,
        showModal, setShowModal, editingProduct, formData, setFormData,
        pagination, handlePageChange, categories, handleFileChange, removeImage
    } = useProducts();

    if (error) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBox} className="text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
                        <p className="text-xs sm:text-sm text-gray-500">Quản lý danh sách sản phẩm ({pagination.total})</p>
                    </div>
                </div>
                <div className="rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
                    <p className="mb-4 text-red-500">{error.message || "Không thể tải danh sách sản phẩm"}</p>
                    <Button variant="outline" onClick={() => handlePageChange(1)}>Thử lại</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="size-9 sm:size-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faBox} className="text-amber-600 text-sm sm:text-lg" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Quản lý sản phẩm</h1>
                        <p className="text-[10px] sm:text-sm text-gray-500">{pagination.total} sản phẩm</p>
                    </div>
                </div>
                <Button onClick={openModal} variant="primary" size="sm" className="shrink-0 shadow-sm">
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm sản phẩm
                </Button>
            </div>

            <div className="rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
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

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Sản phẩm</th>
                                <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Danh mục</th>
                                <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Giá</th>
                                <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Tồn kho</th>
                                <th className="py-3 px-4 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-500">Đã bán</th>
                                <th className="py-3 px-4 text-right text-[10px] font-semibold uppercase tracking-wider text-gray-500"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-gray-500 text-sm">
                                        <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin text-amber-400" />
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {filteredProducts.map((product, i) => (
                                        <tr key={product._id} className={`border-b border-gray-50 last:border-0 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                        {product.images?.[0] ? (
                                                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                                                                <FontAwesomeIcon icon={faImage} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="font-medium text-gray-800 text-sm truncate max-w-[200px]">{product.name}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600">
                                                    <FontAwesomeIcon icon={faTag} className="text-[8px]" />
                                                    {product.category?.name || "Chưa phân loại"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-gray-800 text-sm">{formatCurrency(product.price)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1 text-sm ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                                                    <FontAwesomeIcon icon={faCube} className="text-[10px]" />
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-500">{product.sold || 0}</td>
                                            <td className="py-3 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => handleEdit(product)} className="size-8 rounded-lg hover:bg-blue-50 text-blue-600 transition-all flex items-center justify-center" title="Sửa">
                                                        <FontAwesomeIcon icon={faPen} className="text-xs" />
                                                    </button>
                                                    <button onClick={() => handleDelete(product._id)} className="size-8 rounded-lg hover:bg-red-50 text-red-500 transition-all flex items-center justify-center" title="Xoá">
                                                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                                                Không tìm thấy sản phẩm nào
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden p-2 space-y-2">
                    {loading ? (
                        <div className="py-16 text-center text-gray-500 text-sm">
                            <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin text-amber-400" />
                            Đang tải...
                        </div>
                    ) : (
                        <>
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="flex gap-3 p-3">
                                        <div className="size-16 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-gray-200">
                                                    <FontAwesomeIcon icon={faImage} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-1">
                                                <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{product.name}</p>
                                                <div className="flex gap-0.5 shrink-0 ml-1">
                                                    <button onClick={() => handleEdit(product)} className="size-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faPen} className="text-[11px]" />
                                                    </button>
                                                    <button onClick={() => handleDelete(product._id)} className="size-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center">
                                                        <FontAwesomeIcon icon={faTrash} className="text-[11px]" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-base font-bold text-gray-900 mt-1">{formatCurrency(product.price)}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                                                    <FontAwesomeIcon icon={faTag} className="text-[7px]" />
                                                    {product.category?.name || "Chưa phân loại"}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                                                        <span className={`size-1.5 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
                                                        {product.stock > 0 ? `Còn ${product.stock}` : "Hết hàng"}
                                                    </span>
                                                </div>
                                                {product.sold > 0 && (
                                                    <span className="text-[10px] text-gray-400">· Đã bán {product.sold}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="py-12 text-center text-gray-400 text-sm">
                                    Không tìm thấy sản phẩm nào
                                </div>
                            )}
                        </>
                    )}
                </div>

                {pagination.totalPages > 1 && (
                    <div className="border-t border-gray-100 px-3 sm:px-4 py-3">
                        <Pagination
                            page={pagination.page}
                            totalPages={pagination.totalPages}
                            onChange={handlePageChange}
                            total={pagination.total}
                            label="sản phẩm"
                        />
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faBox} className="text-amber-600 text-sm" />
                                </div>
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                    {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                                </h2>
                            </div>
                            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="size-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors">
                                <span className="text-lg leading-none">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
                            <Input
                                label="Tên sản phẩm"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Nhập tên sản phẩm"
                                required
                            />
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Giá (VND)"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Số lượng tồn kho"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Danh mục</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-400/20 transition-all"
                                    required
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Hình ảnh</label>
                                <label className="flex flex-col items-center justify-center h-28 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:border-amber-400 hover:bg-amber-50/30 cursor-pointer transition-all">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <FontAwesomeIcon icon={faUpload} className="text-gray-300 text-xl mb-1" />
                                    <p className="text-xs text-gray-500">Nhấn để chọn ảnh</p>
                                </label>
                                {formData.images.length > 0 && (
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative size-16 rounded-lg overflow-hidden border border-gray-200 group">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity text-lg"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                                <Button variant="secondary" type="button" onClick={() => { setShowModal(false); resetForm(); }} className="w-full sm:w-auto">
                                    Hủy
                                </Button>
                                <Button type="submit" variant="primary" className="w-full sm:w-auto shadow-sm">
                                    {editingProduct ? "Cập nhật" : "Thêm mới"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
