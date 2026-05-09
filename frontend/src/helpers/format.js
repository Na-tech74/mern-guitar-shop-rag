export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};
export const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};
