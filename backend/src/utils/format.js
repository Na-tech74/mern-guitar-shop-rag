/**
 * Các hàm format dữ liệu dùng chung trong ứng dụng
 */

/**
 * Định dạng giá tiền theo tiền tệ Việt Nam (VND)
 * @param {number} price - Giá cần format
 * @returns {string} Giá đã format (ví dụ: 1.000.000)
 */
export const formatPrice = (price) => {
    if (!price) return 0;
    return new Intl.NumberFormat('vi-VN').format(price);
};

/**
 * Định dạng ngày theo dd/mm/yyyy
 * @param {string|Date} date - Ngày cần format
 * @returns {string} Ngày đã format (ví dụ: 17/05/2026)
 */
export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Định dạng ngày giờ theo dd/mm/yyyy HH:mm
 * @param {string|Date} date - Ngày giờ cần format
 * @returns {string} Ngày giờ đã format (ví dụ: 17/05/2026 14:30)
 */
export const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Làm sạch văn bản - loại bỏ khoảng trắng thừa
 * @param {string} text - Văn bản cần làm sạch
 * @returns {string} Văn bản đã làm sạch
 */
export const sanitizeText = (text) => {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
};

/**
 * Làm sạch email - chuyển về chữ thường và loại bỏ khoảng trắng
 * @param {string} email - Email cần làm sạch
 * @returns {string} Email đã làm sạch
 */
export const sanitizeEmail = (email) => {
    if (!email) return '';
    return email.toLowerCase().trim();
};

/**
 * Format response thành công cho API
 * @param {string} message - Thông báo thành công
 * @param {*} data - Dữ liệu trả về (tùy chọn)
 * @param {object} pagination - Thông tin phân trang (tùy chọn)
 * @returns {object} Response đã format
 */
export const formatSuccessResponse = (message, data = null, pagination = null) => {
    const response = {
        status: 'success',
        message
    };
    if (data) response.data = data;
    if (pagination) response.pagination = pagination;
    return response;
};

/**
 * Format response lỗi cho API
 * @param {string} message - Thông báo lỗi
 * @returns {object} Response lỗi đã format
 */
export const formatErrorResponse = (message) => {
    return {
        status: 'error',
        message
    };
};
