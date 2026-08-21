/**
 * sanitize.middleware.js
 * Custom middleware loại bỏ MongoDB operator injection ($... , key.with.dot)
 * trong req.body, req.params, req.query.
 *
 * Lý do tự viết: express-mongo-sanitize không tương thích Express 5
 * (Express 5 làm req.query thành read-only getter).
 */


/**
Xóa các query parameter nguy hiểm để chống NoSQL injection:
- key.startsWith('$') — chặn các operator như $gt, $ne, $where (vd: ?$gt=...)
- key.includes('.') — chặn truy cập nested field (vd: ?role.admin=...)
Ngăn attacker thao túng query MongoDB qua URL parameters.
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
    sanitizeObject(req.query)
    next();
};
