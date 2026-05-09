import orderModel from "../models/order.models.js";
import { appError } from "../common/appError.js";
import { formatSuccessResponse } from "../utils/format.js";

const isValidObjectId = (id) => id.match(/^[0-9a-fA-F]{24}$/);

export const getAllOrders = async (req, res) => {
    const orders = await orderModel
        .find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    return res.json(formatSuccessResponse("Lấy danh sách đơn hàng thành công!", orders));
};

export const getOrderById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID đơn hàng không hợp lệ!", 400);
    }

    const order = await orderModel
        .findById(id)
        .populate("user", "name email");

    if (!order) {
        throw appError("Đơn hàng không tồn tại!", 404);
    }

    return res.json(formatSuccessResponse("Lấy thông tin đơn hàng thành công!", order));
};

export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
        throw appError("ID đơn hàng không hợp lệ!", 400);
    }

    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw appError("Trạng thái không hợp lệ!", 400);
    }

    const order = await orderModel.findById(id);
    if (!order) {
        throw appError("Đơn hàng không tồn tại!", 404);
    }

    order.status = status;
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