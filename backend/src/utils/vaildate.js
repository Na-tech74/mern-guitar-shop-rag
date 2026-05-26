/**
 * vaildate.js
 * Các hàm kiểm tra và xác thực dữ liệu đầu vào.
 */

/**
 * Kiểm tra định dạng email hợp lệ
 * @param {string} email
 * @returns {boolean}
 */
export const isValidateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Kiểm tra mật khẩu mạnh: ≥8 ký tự, có chữ hoa, chữ thường và số
 * @param {string} password
 * @returns {boolean}
 */
export const isValidatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

/**
 * Kiểm tra ID có phải MongoDB ObjectId hợp lệ không (24 ký tự hex)
 * @param {string} id
 * @returns {boolean}
 */
export const isValidObjectId = (id) => id.match(/^[0-9a-fA-F]{24}$/);

