/**
 * order.model.js
 * Schema cho đơn hàng với danh sách sản phẩm embedded.
 * Mỗi đơn hàng thuộc về một user và có workflow trạng thái.
 */

import mongoose from "mongoose";

/**
 * Schema cho từng sản phẩm trong đơn hàng
 * Lưu snapshot thông tin sản phẩm tại thời điểm đặt hàng
 * (không tham chiếu trực tiếp để tránh thay đổi sau này)
 */
const orderItemSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: {
        type: String,
        default: ""
    }
}, { _id: false });

/**
 * Schema đơn hàng
 */
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "banking"],
        default: "cod"
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    note: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
