import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["new_order", "new_user", "order_status"],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        default: "",
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
