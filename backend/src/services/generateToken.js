/**
 * generateToken.js
 * Service tạo JWT access và refresh tokens cho xác thực người dùng.
 * Access token: thời gian sống ngắn (15 phút)
 * Refresh token: thời gian sống dài (7 ngày)
 */

import jwt from "jsonwebtoken";

/**
 * Tạo access token (thời hạn 24 giờ)
 * @param {string} id - User ID (MongoDB _id)
 * @returns {string} JWT access token
 */
export const generateAccessToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "24h"
        }
    );
};

/**
 * Tạo refresh token (thời hạn 7 ngày)
 * @param {string} id - User ID (MongoDB _id)
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );
};
