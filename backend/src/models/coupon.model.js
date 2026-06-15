/**
 * coupon.model.js
 * Schema cho mã giảm giá / phiếu giảm giá
 * Hỗ trợ giảm theo phần trăm, số tiền cố định hoặc miễn phí vận chuyển
 */

import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    /**
     * Mã giảm giá duy nhất, tự động chuyển sang chữ hoa
     * Ví dụ: "GIAM10", "BLACKFRIDAY", "FREESHIP"
     */
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },

    /**
     * Loại giảm giá:
     * - percentage: Giảm theo % (VD: giảm 10%)
     * - fixed: Giảm số tiền cố định (VD: giảm 50.000đ)
     * - free_shipping: Miễn phí vận chuyển
     */
    type: {
        type: String,
        enum: ["percentage", "fixed", "free_shipping"],
        required: true,
    },

    /**
     * Giá trị giảm:
     * - Nếu type = percentage: số phần trăm (VD: 10 = 10%)
     * - Nếu type = fixed: số tiền VND (VD: 50000)
     * - Nếu type = free_shipping: không dùng đến (để 0)
     */
    value: {
        type: Number,
        required: true,
        min: 0,
    },

    /** Giá trị đơn hàng tối thiểu mới được áp dụng (VND) */
    minOrderValue: {
        type: Number,
        default: 0,
        min: 0,
    },

    /**
     * Giới hạn số tiền giảm tối đa (chỉ áp dụng với type = percentage)
     * Ví dụ: giảm 10% nhưng tối đa chỉ 50.000đ
     */
    maxDiscount: {
        type: Number,
        default: 0,
        min: 0,
    },

    /** Tổng số lượt sử dụng tối đa (0 = không giới hạn) */
    usageLimit: {
        type: Number,
        default: 0,
        min: 0,
    },

    /** Số lượt đã sử dụng */
    usedCount: {
        type: Number,
        default: 0,
        min: 0,
    },

    /** Số lần tối đa mỗi người dùng được sử dụng mã này */
    perUserLimit: {
        type: Number,
        default: 1,
        min: 1,
    },

    /** Ngày bắt đầu hiệu lực */
    startDate: {
        type: Date,
        required: true,
    },

    /** Ngày hết hạn */
    endDate: {
        type: Date,
        required: true,
    },

    /** Bật/tắt mã giảm giá */
    isActive: {
        type: Boolean,
        default: true,
    },

    /**
     * Danh sách sản phẩm được áp dụng (để trống = áp dụng tất cả)
     * Chỉ áp dụng mã cho các sản phẩm cụ thể
     */
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],

    /**
     * Danh sách danh mục được áp dụng (để trống = áp dụng tất cả)
     * Chỉ áp dụng mã cho sản phẩm thuộc các danh mục này
     */
    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    }],
}, { timestamps: true });

export default mongoose.model("Coupon", couponSchema);
