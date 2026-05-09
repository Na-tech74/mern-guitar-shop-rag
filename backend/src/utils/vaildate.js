/**
 * Kiểm tra định dạng email sử dụng regex
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} - True nếu email hợp lệ
 */
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Kiểm tra password đạt độ dài tối thiểu
 * @param {string} password - Password cần kiểm tra
 * @returns {boolean} - True nếu password >= 8 ký tự
 */
export  const validatePassword = (password) => password.length >= 8;
