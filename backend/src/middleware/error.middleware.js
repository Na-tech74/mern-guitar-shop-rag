/**
 * error.middleware.js
 * Global error handler - xử lý tập trung tất cả lỗi trong ứng dụng.
 * Các loại lỗi được xử lý:
 * - Mongoose ValidationError (400): thiếu trường bắt buộc
 * - Mongoose duplicate key 11000 (400): field đã tồn tại
 * - Mongoose CastError (400): ID không hợp lệ
 * - Custom appError: statusCode + message từ controller
 * - Fallback (500): lỗi máy chủ không xác định
 */

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Lỗi máy chủ!";

    if (err.name === "ValidationError") {
        statusCode = 400;
        const fields = Object.keys(err.errors).map(key =>
            err.errors[key].kind === "required" ? key.split(".").pop() : null
        ).filter(Boolean);
        message = fields.length > 0
            ? `Vui lòng nhập đầy đủ thông tin: ${fields.join(", ")}`
            : "Dữ liệu không hợp lệ!";
    }

    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} đã tồn tại!`;
    }

    if (err.name === "CastError") {
        statusCode = 400;
        message = "ID không hợp lệ!";
    }

    return res.status(statusCode).json({
        success: false,
        message,
    });
};