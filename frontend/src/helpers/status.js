export const getStatusColor = (status) => {
    switch (status) {
        case "pending": return "bg-amber-100 text-amber-700";
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
