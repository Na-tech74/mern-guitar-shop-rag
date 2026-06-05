/**
 * users.model.js
 * Định nghĩa schema cho collection Users trong MongoDB
 */

import mongoose from "mongoose";

// Schema định nghĩa cấu trúc document User
const userSchema = new mongoose.Schema({
    // Tên người dùng
    name: {
        type: String,
        required: true, // Bắt buộc nhập
        trim: true // Loại bỏ khoảng trắng đầu/cuối
    },

    // Email người dùng (dùng để đăng nhập)
    email: {
        type: String,
        required: true,
        unique: true, // Không trùng lặp
        lowercase: true, // Chuyển về chữ thường
        trim: true
    },

    // Mật khẩu (đã hash bằng bcrypt)
    password: {
        type: String,
        required: true,
        select: false // Không trả về khi query mặc định (bảo mật)
    },

    // Refresh token dùng để làm mới access token
    refreshToken: {
        type: String,
        default: "",
        select: false // Không trả về khi query
    },
    // Mã OTP đặt lại mật khẩu (đã hash)
    resetOtp: {
        type: String,
        default: ""
    },

    // Thời hạn của mã OTP (timestamp)
    resetOtpExpire: {
        type: Number,
        default: 0
    },

    // Vai trò người dùng: user hoặc admin
    role: {
        type: String,
        enum: ["user", "admin"], // Chỉ chấp nhận 2 giá trị này
        default: "user"
    },

}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

export default mongoose.model("Users", userSchema);