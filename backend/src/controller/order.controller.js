/**
 * order.controller.js
 * Xử lý các API liên quan đến đơn hàng: tạo đơn, lấy danh sách,
 * thống kê dashboard, cập nhật trạng thái, xóa đơn hàng.
 */

import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/users.model.js";
import Category from "../models/categories.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { isValidObjectId } from "../utils/valid.js";

/**
 * Tạo đơn hàng mới từ giỏ hàng
 * Kiểm tra tồn kho, cập nhật stock và sold của từng sản phẩm
 */
export const createOrder = async (req, res) => {
    const { items, shippingAddress, paymentMethod, note } = req.body;

    if (!items || items.length === 0) {
        throw appError("Giỏ hàng trống!", 400);
    }

    const trimmed = {
        fullName: shippingAddress?.fullName?.trim(),
        phone: shippingAddress?.phone?.trim(),
        address: shippingAddress?.address?.trim(),
        city: shippingAddress?.city?.trim()
    };

    if (!trimmed.fullName || !trimmed.phone || !trimmed.address || !trimmed.city) {
        throw appError("Vui lòng nhập đầy đủ thông tin giao hàng!", 400);
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
        if (!item.productId) {
            throw appError("Thiếu thông tin sản phẩm!", 400);
        }

        if (!isValidObjectId(item.productId)) {
            throw appError("ID sản phẩm không hợp lệ!", 400);
        }

        const product = await Product.findById(item.productId);
        if (!product) {
            throw appError(`Sản phẩm "${item.product}" không tồn tại!`, 404);
        }

        if (product.stock < item.quantity) {
            throw appError(`Sản phẩm "${product.name}" không đủ hàng (còn ${product.stock})!`, 400);
        }

        const lineTotal = product.price * item.quantity;
        total += lineTotal;

        orderItems.push({
            product: product.name,
            productId: product._id,
            price: product.price,
            quantity: item.quantity,
            image: product.images?.[0] || ""
        });

        product.stock -= item.quantity;
        product.sold += item.quantity;
        await product.save();
    }

    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress: trimmed,
        paymentMethod: paymentMethod || "cod",
        total,
        note: note || ""
    });

    return appSuccess(res, {
        statusCode: 201,
        message: "Đặt hàng thành công!",
        data: { order }
    });
};

/**
 * Lấy danh sách đơn hàng của người dùng hiện tại (có phân trang)
 */
export const getMyOrders = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const total = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh sách đơn hàng thành công!",
        data: {
            orders,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        }
    });
};

/**
 * Lấy tất cả đơn hàng (admin). Có phân trang và lọc theo trạng thái.
 */
export const getAllOrders = async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalPages = Math.ceil(total / limit);

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh sách đơn hàng thành công!",
        data: {
            orders,
            page: parseInt(page),
            totalPages,
            total
        }
    });
};

/**
 * Lấy thống kê cho admin dashboard.
 * Chạy đồng thời nhiều truy vấn bằng Promise.all:
 * tổng sản phẩm/user/category/order, phân bố trạng thái, doanh thu, 5 đơn gần nhất.
 */
export const getDashboardStats = async (req, res) => {
    const [
        totalProducts,
        totalUsers,
        totalCategories,
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        revenueResult,
        recentOrders
    ] = await Promise.all([
        Product.countDocuments(),
        User.countDocuments(),
        Category.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ status: "pending" }),
        Order.countDocuments({ status: "processing" }),
        Order.countDocuments({ status: "shipped" }),
        Order.countDocuments({ status: "delivered" }),
        Order.countDocuments({ status: "cancelled" }),
        Order.aggregate([
            { $match: { status: "delivered" } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]),
        Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5)
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy thống kê thành công!",
        data: {
            totalProducts,
            totalUsers,
            totalCategories,
            totalOrders,
            orderStats: {
                pending: pendingOrders,
                processing: processingOrders,
                shipped: shippedOrders,
                delivered: deliveredOrders,
                cancelled: cancelledOrders
            },
            totalRevenue,
            recentOrders
        }
    });
};

/**
 * Lấy chi tiết đơn hàng.
 * Admin xem được tất cả, user chỉ xem được đơn của mình.
 */
export const getOrderById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID đơn hàng không hợp lệ!", 400);
    }

    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
        throw appError("Đơn hàng không tồn tại!", 404);
    }

    if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
        throw appError("Bạn không có quyền xem đơn hàng này!", 403);
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy chi tiết đơn hàng thành công!",
        data: { order }
    });
};

/**
 * Cập nhật trạng thái đơn hàng (admin).
 * Kiểm tra workflow hợp lệ: pending→processing→shipped→delivered,
 * chỉ hủy được từ pending, không thay đổi đơn đã kết thúc.
 */
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

    const order = await Order.findById(id);
    if (!order) {
        throw appError("Đơn hàng không tồn tại!", 404);
    }

    if (status === "cancelled" && order.status !== "pending") {
        throw appError("Chỉ có thể hủy đơn hàng ở trạng thái chờ xử lý!", 400);
    }

    if (order.status === "cancelled" || order.status === "delivered") {
        throw appError("Không thể thay đổi trạng thái đơn hàng đã kết thúc!", 400);
    }

    order.status = status;
    await order.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật trạng thái đơn hàng thành công!",
        data: { order }
    });
};

/**
 * Xóa đơn hàng (admin).
 */
export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID đơn hàng không hợp lệ!", 400);
    }

    const order = await Order.findById(id);
    if (!order) {
        throw appError("Đơn hàng không tồn tại!", 404);
    }

    await Order.findByIdAndDelete(id);

    return appSuccess(res, {
        statusCode: 200,
        message: "Xóa đơn hàng thành công!"
    });
};
