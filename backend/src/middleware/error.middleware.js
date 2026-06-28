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

/**
 * Global error handler middleware - xử lý và trả về lỗi tập trung
 * @param {Error} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Lỗi máy chủ!";

    if (err.name === "ValidationError") {
        statusCode = 400;
        /*
        1. Object.keys(err.errors) → lấy mảng tên các field bị lỗi (vd: ["name", "email"])
 2. .map(...) → với mỗi field, kiểm tra nếu lỗi là required thì lấy tên field (dùng key.split(".").pop() để lấy field cuối nếu là nested path), nếu không phải required thì trả null
 3. .filter(Boolean) → loại bỏ các null, chỉ giữ lại field bị thiếu (required)
 Ví dụ: nếu name và email là required → kết quả ["name", "email"]. Nếu chỉ email là required → ["email"].
         */
        const fields = Object.keys(err.errors).map(key =>
            err.errors[key].kind === "required" ? key.split(".").pop() : null
        ).filter(Boolean);
        message = fields.length > 0
            ? `Vui lòng nhập đầy đủ thông tin: ${fields.join(", ")}`
            : "Dữ liệu không hợp lệ!";
    }
    // Mã lỗi 11000 — duplicate key (unique constraint). Lấy tên field bị trùng từ err.keyValue, trả về "email đã tồn tại!" (status 400).
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} đã tồn tại!`;
    }
    //CastError — sai định dạng ObjectId, ví dụ truyền "abc" thay vì MongoDB ObjectId. Trả về "ID không hợp lệ!" (status 400).
    if (err.name === "CastError") {
        statusCode = 400;
        message = "ID không hợp lệ!";
    }

    return res.status(statusCode).json({
        success: false,
        message,
    });
};
