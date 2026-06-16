import Notification from "../models/notification.model.js";
import { appSuccess } from "../utils/appResponse.js";

export const getNotifications = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const [notifications, total, unreadCount] = await Promise.all([
        Notification.find()
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum),
        Notification.countDocuments(),
        Notification.countDocuments({ isRead: false }),
    ]);

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh sách thông báo thành công!",
        data: {
            notifications,
            unreadCount,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            }
        }
    });
};

export const markAsRead = async (req, res) => {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    return appSuccess(res, {
        statusCode: 200,
        message: "Đã đánh dấu đã đọc!",
    });
};

export const markAllAsRead = async (req, res) => {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    return appSuccess(res, {
        statusCode: 200,
        message: "Đã đánh dấu tất cả đã đọc!",
    });
};

export const createNotification = async (type, message, link = "") => {
    try {
        await Notification.create({ type, message, link });
    } catch {
        // silently fail
    }
};
