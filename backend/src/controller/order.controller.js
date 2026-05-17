import orderModel from "../models/order.models.js";
import { appError } from "../utils/appResponse.js";
import { formatSuccessResponse } from "../utils/format.js";
import { isValidObjectId } from "../utils/vaildate.js";

export const createOrder = async (req, res) => {
    const { items, shippingInfo, paymentMethod, totalPrice, shippingPrice, total, note } = req.body;

    if (!items || items.length === 0) {
        throw appError("Giỏ hàng trống!", 400);
    }

    if (!shippingInfo?.fullName || !shippingInfo?.phone || !shippingInfo?.address || !shippingInfo?.city) {
        throw appError("Thông tin giao hàng không đầy đủ!", 400);
    }
    
    const order = await orderModel.create({
        user: req.user._id,
        items,
        shippingInfo,
        paymentMethod: paymentMethod || 'cod',
        totalPrice,
        shippingPrice: shippingPrice || 0,
        total,
        note
    });

    return res.status(201).json(formatSuccessResponse("Tạo đơn hàng thành công!", order));
};

export const getUserOrders = async (req, res) => {
    const orders = await orderModel
        .find({ user: req.user._id })
        .populate("items.product", "name image price")
        .sort({ createdAt: -1 });

    return res.json(formatSuccessResponse("Lấy đơn hàng thành công!", orders));
};

export const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        
        const query = {};
        if (status) query.status = status;

        const total = await orderModel.countDocuments(query);
        const orders = await orderModel
            .find(query)
            .populate("user", "name email phone")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        return res.json(formatSuccessResponse("Lấy danh sách đơn hàng thành công!", {
            orders,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit)
        }));
    } catch (err) {
        console.error("Error getAllOrders:", err);
        return res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

export const getOrderById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID đơn hàng không hợp lệ!", 400);
    }

    const order = await orderModel
        .findById(id)
        .populate("user", "name email phone")
        .populate("items.product", "name image price");

    if (!order) {
        throw appError("Đơn hàng không tồn tại!", 404);
    }

    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        throw appError("Bạn không có quyền xem đơn hàng này!", 403);
    }

    return res.json(formatSuccessResponse("Lấy thông tin đơn hàng thành công!", order));
};

export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
        throw appError("ID đơn hàng không hợp lệ!", 400);
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw appError("Trạng thái không hợp lệ!", 400);
    }

    const order = await orderModel.findById(id);
    if (!order) {
        throw appError("Đơn hàng không tồn tại!", 404);
    }

    order.status = status;
    
    if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
    }
    
    await order.save();

    return res.json(formatSuccessResponse("Cập nhật trạng thái thành công!", order));
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID đơn hàng không hợp lệ!", 400);
    }

    const order = await orderModel.findById(id);
    if (!order) {
        throw appError("Đơn hàng không tồn tại!", 404);
    }

    await order.deleteOne();

    return res.json(formatSuccessResponse("Xóa đơn hàng thành công!"));
};