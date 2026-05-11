import orderModel from "../models/order.models.js";
import { appError } from "../common/appError.js";
import { formatSuccessResponse } from "../utils/format.js";
import { isValidObjectId } from "../utils/vaildate.js";

/**
 * Tạo đơn hàng mới
 * POST /api/orders/create-orders
 * Yêu cầu: đã đăng nhập
 * Body: { items, shippingInfo, paymentMethod, totalPrice, shippingPrice, total, note }
 */
export const createOrder = async (req, res) => {
    const { items, shippingInfo, paymentMethod, totalPrice, shippingPrice, total, note } = req.body;

    // Kiểm tra giỏ hàng không trống
    if (!items || items.length === 0) {
        throw appError("Giỏ hàng trống!", 400);
    }

    // Kiểm tra thông tin giao hàng đầy đủ
    if (!shippingInfo?.fullName || !shippingInfo?.phone || !shippingInfo?.address || !shippingInfo?.city) {
        throw appError("Thông tin giao hàng không đầy đủ!", 400);
    }
    
    // Tạo đơn hàng với user từ token đã xác thực
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

/**
 * Lấy đơn hàng của user đang đăng nhập
 * GET /api/orders/get-my-orders
 * Yêu cầu: đã đăng nhập
 */
export const getUserOrders = async (req, res) => {
    const orders = await orderModel
        .find({ user: req.user._id })
        .populate("items.product", "name image price")
        .sort({ createdAt: -1 });

    return res.json(formatSuccessResponse("Lấy đơn hàng thành công!", orders));
};

/**
 * Lấy tất cả đơn hàng (Admin)
 * GET /api/orders/get-all-orders
 * Yêu cầu: admin
 * Query: page, limit, status
 */
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

/**
 * Lấy chi tiết đơn hàng theo ID
 * GET /api/orders/:id
 * Yêu cầu: đã đăng nhập, là chủ đơn hoặc admin
 */
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

    // Kiểm tra quyền: chỉ chủ đơn hoặc admin mới xem được
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        throw appError("Bạn không có quyền xem đơn hàng này!", 403);
    }

    return res.json(formatSuccessResponse("Lấy thông tin đơn hàng thành công!", order));
};

/**
 * Cập nhật trạng thái đơn hàng (Admin)
 * PUT /api/orders/:id/status
 * Yêu cầu: admin
 * Body: { status }
 * Status: pending -> processing -> shipped -> delivered / cancelled
 */
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
        throw appError("ID đơn hàng không hợp lệ!", 400);
    }

    // Các trạng thái hợp lệ
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw appError("Trạng thái không hợp lệ!", 400);
    }

    const order = await orderModel.findById(id);
    if (!order) {
        throw appError("Đơn hàng không tồn tại!", 404);
    }

    order.status = status;
    
    // Nếu giao hàng thành công thì cập nhật isDelivered
    if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
    }
    
    await order.save();

    return res.json(formatSuccessResponse("Cập nhật trạng thái thành công!", order));
};

/**
 * Xóa đơn hàng (Admin)
 * DELETE /api/orders/:id
 * Yêu cầu: admin
 */
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