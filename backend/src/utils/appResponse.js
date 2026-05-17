/**
 * appResponse.js
 * Utility functions tạo response chuẩn cho API
 */

/**
 * Tạo error object để throw trong controller
 * @param {string} message - Thông báo lỗi
 * @param {number} statusCode - Mã HTTP status
 * @returns {Error} Error object với thêm properties success và statusCode
 */
export const appError = (message, statusCode) => {
    const error = new Error(message);

    error.success = false;
    error.statusCode = statusCode;

    return error;
};

/**
 * Trả về response thành công cho client
 * @param {object} res - Express response object
 * @param {object} options - { statusCode, message, data }
 * @returns {JSON} Response JSON chuẩn format
 */
export const appSuccess = (res, { message, statusCode, data = {} } = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};