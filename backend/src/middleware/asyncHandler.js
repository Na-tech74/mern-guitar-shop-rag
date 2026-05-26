/**
 * asyncHandler.js
 * Wrapper cho async route handlers.
 * Chuyển mọi lỗi (sync và async) đến error handler qua next(err).
 */

export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
