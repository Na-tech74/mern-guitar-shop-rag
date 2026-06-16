/**
 * asyncHandler.js
 * Wrapper cho async route handlers.
 * Chuyển mọi lỗi (sync và async) đến error handler qua next(err).
 */

/**
 * Wrap async function để tự động catch lỗi và chuyển đến error handler
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function với error catching
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
