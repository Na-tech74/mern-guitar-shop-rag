/**
 * asyncHandler.js
 * Wrapper cho async route handlers.
 * Bắt cả synchronous exceptions và promise rejections,
 * chuyển đến error handler qua next(err).
 * Xử lý fallback khi next không phải function.
 */

export const asyncHandler = (fn) => (req, res, next) => {
    try {
        const result = fn(req, res, next);
        if (result && typeof result.catch === "function") {
            result.catch(err => {
                if (typeof next !== "function") {
                    console.error("asyncHandler: next is not a function", { next, err });
                    return res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
                }
                next(err);
            });
        }
    } catch (err) {
        if (typeof next !== "function") {
            console.error("asyncHandler sync: next is not a function", { next, err });
            return res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
        }
        next(err);
    }
};
