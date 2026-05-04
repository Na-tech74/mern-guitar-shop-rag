/* ==================== FORMAT GIÁ TIỀN ==================== */
export const formatPrice = (price) => {
    if (!price) return 0;
    return new Intl.NumberFormat('vi-VN').format(price);
};

/* ==================== FORMAT NGÀY THÁNG ==================== */
export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

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

/* ==================== LOẠI BỎ KÝ TỰ XẤU ==================== */
export const sanitizeText = (text) => {
    if (!text) return '';
    return text.trim().replace(/\s+/g, ' ');
};

export const sanitizeEmail = (email) => {
    if (!email) return '';
    return email.toLowerCase().trim();
};

/* ==================== FORMAT RESPONSE ==================== */
export const formatSuccessResponse = (message, data = null, pagination = null) => {
    const response = {
        status: 'success',
        message
    };
    if (data) response.data = data;
    if (pagination) response.pagination = pagination;
    return response;
};

export const formatErrorResponse = (message) => {
    return {
        status: 'error',
        message
    };
};
