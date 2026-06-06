import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faTrash, faSearch, faImage, faUpload, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../../helpers/format";
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
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
                    <p className="text-gray-500">Quản lý danh sách sản phẩm ({pagination.total})</p>
                </div>
                <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                    <p className="mb-4 text-red-500">{error.message || "Không thể tải danh sách sản phẩm"}</p>
                    <Button variant="outline" onClick={() => handlePageChange(1)}>Thử lại</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
                    <p className="text-gray-500">Quản lý danh sách sản phẩm ({pagination.total})</p>
                </div>
                <Button onClick={openModal} variant="primary">
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm sản phẩm
                </Button>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-10 text-sm outline-none focus:border-amber-500"
                        />
                        {refetching && (
                            <FontAwesomeIcon
                                icon={faSpinner}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 animate-spin"
                                aria-label="Đang tải lại"
                            />
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Ảnh</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Tên sản phẩm</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Danh mục</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Giá</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Tồn kho</th>
                                <th className="pb-3 text-left text-xs font-medium uppercase text-gray-500">Đã bán</th>
                                <th className="pb-3 text-right text-xs font-medium uppercase text-gray-500">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-500">
                                        <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin text-amber-400" />
                                        Đang tải sản phẩm...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {filteredProducts.map((product) => (
                                        <tr key={product._id} className="border-b border-gray-100 last:border-0">
                                            <td className="py-3">
                                                <div className="size-10 rounded-lg bg-gray-100 overflow-hidden">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                            <FontAwesomeIcon icon={faImage} />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <p className="font-medium text-gray-800">{product.name}</p>
                                            </td>
                                            <td className="py-3 text-sm text-gray-600">
                                                {product.category?.name || "Chưa phân loại"}
                                            </td>
                                            <td className="py-3 font-medium text-gray-800">
                                                {formatCurrency(product.price)}
                                            </td>
                                            <td className="py-3">
                                                <span className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="py-3 text-sm text-gray-600">{product.sold || 0}</td>
                                            <td className="py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(product._id)}>
                                                        <FontAwesomeIcon icon={faTrash} className="text-red-600" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-gray-500">
                                                Không tìm thấy sản phẩm nào
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.totalPages > 1 && (
                    <Pagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        onChange={handlePageChange}
                        total={pagination.total}
                        label="sản phẩm"
                    />
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">
                            {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
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
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
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
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-amber-500 transition cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <FontAwesomeIcon icon={faUpload} className="text-gray-400 text-2xl mb-2" />
                                        <p className="text-sm text-gray-500">Nhấn để chọn ảnh</p>
                                    </label>
                                </div>
                                {formData.images.length > 0 && (
                                    <div className="mt-2 flex gap-2 flex-wrap">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative size-20 rounded-lg overflow-hidden border">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <Button 
                                                    variant="danger" 
                                                    size="sm"
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-0 right-0 size-5 !p-0 flex items-center justify-center"
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button variant="secondary" type="button" onClick={() => { setShowModal(false); resetForm(); }}>
                                    Hủy
                                </Button>
                                <Button type="submit" variant="primary">
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
