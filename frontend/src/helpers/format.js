export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};
export const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};

const CLOUDINARY_REGEX = /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//;

export const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

export const getStatusColor = (status) => {
    switch (status) {
        case "pending": return "bg-yellow-100 text-yellow-700";
        case "processing": return "bg-blue-100 text-blue-700";
        case "shipped": return "bg-purple-100 text-purple-700";
        case "delivered": return "bg-green-100 text-green-700";
        case "completed": return "bg-green-100 text-green-700";
        case "cancelled": return "bg-red-100 text-red-700";
        default: return "bg-gray-100 text-gray-700";
    }
};

export const getStatusLabel = (status) => {
    switch (status) {
        case "pending": return "Chờ xử lý";
        case "processing": return "Đang xử lý";
        case "shipped": return "Đang giao";
        case "delivered": return "Đã giao";
        case "completed": return "Hoàn thành";
        case "cancelled": return "Đã hủy";
        default: return status;
    }
};

export function getOptimizedImage(url, width = 400) {
    if (!url) return url;
    if (CLOUDINARY_REGEX.test(url)) {
        const transform = `w_${width},c_fill,q_auto,f_auto`;
        return url.replace('/upload/', `/upload/${transform}/`);
    }
    return url;
}
