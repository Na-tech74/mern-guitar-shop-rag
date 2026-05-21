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

export function getOptimizedImage(url, width = 400) {
    if (!url) return url;
    if (CLOUDINARY_REGEX.test(url)) {
        const transform = `w_${width},c_fill,q_auto,f_auto`;
        return url.replace('/upload/', `/upload/${transform}/`);
    }
    return url;
}
