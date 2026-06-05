/**
 * sanitize.middleware.js
 * Custom middleware loại bỏ MongoDB operator injection ($... , key.with.dot)
 * trong req.body, req.params, req.query.
 *
 * Lý do tự viết: express-mongo-sanitize không tương thích Express 5
 * (Express 5 làm req.query thành read-only getter).
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
