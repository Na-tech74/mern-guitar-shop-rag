/**
 * cookier.js
 * Utility functions quản lý cookies cho refresh token
 */

const isProduction = process.env.NODE_ENV === "production";

/**
 * Đặt refresh token vào cookie
 * @param {object} res - Express response object
 * @param {string} token - Refresh token cần lưu
 */
export const refreshTokenCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true, // Chỉ server đọc được, JS không truy cập (bảo vệ XSS)
        secure: isProduction, // Chỉ gửi qua HTTPS khi production
        sameSite: isProduction ? "strict" : "lax", // Bảo vệ CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // Hết hạn sau 7 ngày
    });
};

/**
 * Xóa refresh token khỏi cookie
 * @param {object} res - Express response object
 */
export const clearCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
    });
};