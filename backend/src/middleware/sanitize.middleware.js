/**
 * sanitize.middleware.js
 * Custom middleware loại bỏ MongoDB operator injection ($... , key.with.dot)
 * trong req.body, req.params, req.query.
 *
 * Lý do tự viết: express-mongo-sanitize không tương thích Express 5
 * (Express 5 làm req.query thành read-only getter).
 */

/**
 * Đệ quy xóa các key bắt đầu bằng '$' hoặc chứa '.' trong object
 * @param {Object} obj - Object cần sanitize
 */
const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') 
        return;
    for (const key of Object.keys(obj)) {
        if (key.startsWith('$') || key.includes('.')) {
            delete obj[key];
        } else if (typeof obj[key] === 'object') {
            sanitizeObject(obj[key]);
        }
    }
};

/**
 * Middleware sanitize request - loại bỏ NoSQL injection khỏi body, params, query
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const mongoSanitize = (req, res, next) => {
    sanitizeObject(req.body);
    sanitizeObject(req.params);

    if (req.query) {
        for (const key of Object.keys(req.query)) {
            if (key.startsWith('$') || key.includes('.')) {
                delete req.query[key];
            }
        }
    }

    next();
};
