import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus, faPen, faTrash, faSearch, faSpinner, faTag,
    faEye, faEyeSlash, faCalendar, faPercent, faMoneyBillWave,
    faTruck, faInfinity, faCheck, faTimes
} from "@fortawesome/free-solid-svg-icons";
import { formatDate, formatDateTime, formatCurrency } from "../../helpers/formatters";
import { useCoupons } from "./hooks/useCoupons";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Pagination from "../../components/Pagination";

const typeIcons = {
    percentage: faPercent,
    fixed: faMoneyBillWave,
    free_shipping: faTruck,
};

const typeLabels = {
    percentage: "Phần trăm",
    fixed: "Cố định",
    free_shipping: "Miễn phí vận chuyển",
};

export default function Coupons() {
    const {
        loading, refetching, coupons, searchTerm, setSearchTerm,
        page, totalPages, total, setPage,
        handleSubmit, handleDelete, handleEdit, handleToggleActive,
        resetForm, openModal, showModal, setShowModal,
        editingCoupon, formData, setFormData, fetchCoupons
    } = useCoupons();

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
                        <FontAwesomeIcon icon={faTag} className="text-amber-600 text-sm sm:text-lg" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-2xl font-bold text-gray-900 whitespace-nowrap">Quản lý mã giảm giá</h1>
                        <p className="text-[10px] sm:text-sm text-gray-500">{total} mã giảm giá</p>
                    </div>
                </div>
                <Button onClick={openModal} variant="primary" size="sm" className="shrink-0 shadow-sm">
                    <FontAwesomeIcon icon={faPlus} />
                    Thêm mã
                </Button>
            </div>

            <div className="rounded-xl bg-white shadow-sm border border-gray-100">
                <div className="p-3 sm:p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm mã giảm giá..."
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

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Mã</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Loại</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Giá trị</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Hiệu lực</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Đã dùng</th>
                                <th className="text-center px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Trạng thái</th>
                                <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                                        Không tìm thấy mã giảm giá nào
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => (
                                    <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="font-mono font-bold text-gray-900 text-sm">{coupon.code}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 text-gray-600">
                                                <FontAwesomeIcon icon={typeIcons[coupon.type]} className="text-xs" />
                                                {typeLabels[coupon.type]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {coupon.type === "percentage" ? (
                                                <span className="font-medium">{coupon.value}%</span>
                                            ) : coupon.type === "fixed" ? (
                                                <span className="font-medium">{formatCurrency(coupon.value)}</span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                            {coupon.type === "percentage" && coupon.maxDiscount > 0 && (
                                                <span className="text-xs text-gray-400 ml-1">
                                                    (tối đa {formatCurrency(coupon.maxDiscount)})
                                                </span>
                                            )}
                                            {coupon.minOrderValue > 0 && (
                                                <div className="text-[10px] text-gray-400">
                                                    Đơn tối thiểu: {formatCurrency(coupon.minOrderValue)}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-xs text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faCalendar} className="text-[10px] text-gray-400" />
                                                    {formatDate(coupon.startDate)}
                                                </div>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <FontAwesomeIcon icon={faCalendar} className="text-[10px] text-gray-400" />
                                                    {formatDate(coupon.endDate)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-gray-600">
                                                {coupon.usedCount}
                                                {coupon.usageLimit > 0 && (
                                                    <span className="text-gray-400"> / {coupon.usageLimit}</span>
                                                )}
                                                {coupon.usageLimit === 0 && (
                                                    <FontAwesomeIcon icon={faInfinity} className="text-xs text-gray-300 ml-1" />
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleToggleActive(coupon)}
                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                                                    coupon.isActive
                                                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                                }`}
                                            >
                                                <FontAwesomeIcon icon={coupon.isActive ? faEye : faEyeSlash} className="text-[10px]" />
                                                {coupon.isActive ? "Hoạt động" : "Tắt"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => handleEdit(coupon)}
                                                    className="size-8 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faPen} className="text-xs" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon._id)}
                                                    className="size-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="sm:hidden p-2 space-y-2">
                    {coupons.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">
                            Không tìm thấy mã giảm giá nào
                        </div>
                    ) : (
                        coupons.map((coupon) => (
                            <div key={coupon._id} className="rounded-lg border border-gray-100 bg-white p-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono font-bold text-gray-900">{coupon.code}</span>
                                    <button
                                        onClick={() => handleToggleActive(coupon)}
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                            coupon.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                                        }`}
                                    >
                                        <FontAwesomeIcon icon={coupon.isActive ? faEye : faEyeSlash} className="mr-1 text-[8px]" />
                                        {coupon.isActive ? "Hoạt động" : "Tắt"}
                                    </button>
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                                    <FontAwesomeIcon icon={typeIcons[coupon.type]} className="text-[10px]" />
                                    {typeLabels[coupon.type]}
                                    <span className="text-gray-300">|</span>
                                    {coupon.type === "percentage" ? `${coupon.value}%` : coupon.type === "fixed" ? formatCurrency(coupon.value) : "-"}
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-400">
                                    <span>Đã dùng: {coupon.usedCount}{coupon.usageLimit > 0 ? `/${coupon.usageLimit}` : ""}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}</span>
                                </div>
                                <div className="mt-2 flex justify-end gap-2 pt-2 border-t border-gray-50">
                                    <button onClick={() => handleEdit(coupon)} className="text-blue-600 text-xs font-medium">Sửa</button>
                                    <button onClick={() => handleDelete(coupon._id)} className="text-red-500 text-xs font-medium">Xóa</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="px-4 pb-4">
                    <Pagination page={page} totalPages={totalPages} onChange={setPage} total={total} label="mã giảm giá" />
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="size-9 rounded-lg bg-amber-100 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faTag} className="text-amber-600 text-sm" />
                                </div>
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                    {editingCoupon ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá mới"}
                                </h2>
                            </div>
                            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="size-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-colors">
                                <span className="text-lg leading-none">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Mã giảm giá"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="VD: GIAM10, FREESHIP"
                                    required
                                />
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Loại giảm giá <span className="text-red-500">*</span></label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                                        required
                                    >
                                        <option value="percentage">Giảm theo phần trăm</option>
                                        <option value="fixed">Giảm số tiền cố định</option>
                                        <option value="free_shipping">Miễn phí vận chuyển</option>
                                    </select>
                                </div>
                                <Input
                                    label={formData.type === "percentage" ? "Phần trăm giảm" : formData.type === "fixed" ? "Số tiền giảm (VND)" : "Giá trị"}
                                    type="number"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    placeholder={formData.type === "percentage" ? "VD: 10" : formData.type === "fixed" ? "VD: 50000" : "0"}
                                    min="0"
                                    required={formData.type !== "free_shipping"}
                                />
                                <Input
                                    label="Đơn hàng tối thiểu (VND)"
                                    type="number"
                                    value={formData.minOrderValue}
                                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                                    placeholder="0 = không yêu cầu"
                                    min="0"
                                />
                                {formData.type === "percentage" && (
                                    <Input
                                        label="Giảm tối đa (VND)"
                                        type="number"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                        placeholder="0 = không giới hạn"
                                        min="0"
                                    />
                                )}
                                <Input
                                    label="Tổng lượt sử dụng"
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    placeholder="0 = không giới hạn"
                                    min="0"
                                />
                                <Input
                                    label="Số lần / người dùng"
                                    type="number"
                                    value={formData.perUserLimit}
                                    onChange={(e) => setFormData({ ...formData, perUserLimit: e.target.value })}
                                    min="1"
                                />
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Ngày bắt đầu <span className="text-red-500">*</span></label>
                                    <input
                                        type="datetime-local"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Ngày kết thúc <span className="text-red-500">*</span></label>
                                    <input
                                        type="datetime-local"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        formData.isActive ? "bg-emerald-500" : "bg-gray-300"
                                    }`}
                                >
                                    <span className={`inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform ${
                                        formData.isActive ? "translate-x-6" : "translate-x-0.5"
                                    }`} />
                                </button>
                                <span className="text-sm text-gray-700">
                                    {formData.isActive ? "Kích hoạt" : "Vô hiệu"}
                                </span>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                                <Button variant="secondary" type="button" onClick={() => { setShowModal(false); resetForm(); }} className="w-full sm:w-auto">
                                    Hủy
                                </Button>
                                <Button type="submit" variant="primary" className="w-full sm:w-auto shadow-sm">
                                    {editingCoupon ? "Cập nhật" : "Thêm mới"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
