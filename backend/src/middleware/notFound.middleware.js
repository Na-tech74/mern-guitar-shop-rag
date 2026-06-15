/**
 * notFound.middleware.js
 * Middleware bắt request không khớp route nào, trả 404 qua errorHandler.
 */

import { appError } from "../utils/appResponse.js";

/**
 * Xử lý 404 - route không tồn tại
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const notFoundHandler = (req, res, next) => {
    return next(appError(`Không tìm thấy route: ${req.method} ${req.originalUrl}`, 404));
};
