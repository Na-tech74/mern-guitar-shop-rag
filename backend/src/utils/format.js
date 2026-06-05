/**
 * Các hàm format dữ liệu dùng chung trong ứng dụng
 */

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
