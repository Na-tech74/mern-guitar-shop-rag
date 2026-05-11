import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    // Người dùng đặt hàng
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Danh sách sản phẩm trong đơn
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            image: { type: String },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    // Thông tin giao hàng
    shippingInfo: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true }
    },
    // Phương thức thanh toán (cod = thanh toán khi nhận hàng)
    paymentMethod: { type: String, default: 'cod' },
    // Tổng tiền sản phẩm
    totalPrice: { type: Number, required: true },
    // Phí vận chuyển
    shippingPrice: { type: Number, default: 0 },
    // Tổng cộng (bao gồm shipping)
    total: { type: Number, required: true },
    // Trạng thái thanh toán
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    // Trạng thái giao hàng
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    // Trạng thái đơn hàng: pending -> processing -> shipped -> delivered / cancelled
    status: { type: String, default: 'pending' },
    // Ghi chú của khách
    note: { type: String }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);