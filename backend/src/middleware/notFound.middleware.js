/**
 * notFound.middleware.js
 * Middleware bắt request không khớp route nào, trả 404 qua errorHandler.
 */

import { appError } from "../utils/appResponse.js";

export const notFoundHandler = (req, res, next) => {
    return next(appError(`Không tìm thấy route: ${req.method} ${req.originalUrl}`, 404));
};
