/**
 * products.models.js
 * Schema cho sản phẩm trong cửa hàng guitar
 */

import mongoose from "mongoose";

/**
 * Product schema - Lưu thông tin sản phẩm
 */
const productSchema = new mongoose.Schema({
    /**
     * Tên sản phẩm
     * Ví dụ: "Fender Stratocaster", "Gibson Les Paul"
     */
    name: {
        type: String,
        required: true,
        trim: true
    },

    /**
     * Mô tả chi tiết sản phẩm
     */
    description: {
        type: String,
        required: true,
        trim: true
    },

    /**
     * Giá sản phẩm (VND)
     * Giá trị tối thiểu = 0
     */
    price: {
        type: Number,
        required: true,
        min: 0,
    },

    /**
     * Danh mục sản phẩm
     * Tham chiếu đến Category
     */
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    /**
     * Số lượng tồn kho
     * Số nguyên không âm
     */
    stock: {
        type: Number,
        required: true,
        min: 0
    },

    /**
     * Số sản phẩm đã bán
     */
    sold: {
        type: Number,
        default: 0,
        min: 0
    },

    /**
     * Danh sách URL hình ảnh sản phẩm
     * Mảng các đường dẫn ảnh
     */
    images: [String],
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

export default mongoose.model("Product", productSchema);