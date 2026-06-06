/**
 * generateToken.js
 * Service tạo JWT access và refresh tokens cho xác thực người dùng.
 * Access token: thời gian sống ngắn (15 phút)
 * Refresh token: thời gian sống dài (7 ngày)
 */

import jwt from "jsonwebtoken";

/**
 * Tạo access token (thời hạn 15 phút)
 * @param {Object} user - User document (cần _id và role)
 * @returns {string} JWT access token
 */
export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m"
        }
    );
};

/**
 * Tạo refresh token (thời hạn 7 ngày)
 * @param {Object} user - User document (cần _id và role)
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );
};
