import usersModel from "../models/users.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken } from "../services/generateToken.js";
import { sendEmail } from "../services/sendEmail.js";
import { appError } from "../common/appError.js";
import { validateEmail, validatePassword } from "../utils//vaildate.js"
/**
 * @desc Đăng ký người dùng mới
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !email || !password) {
        throw appError("Vui lòng nhập đầy đủ thông tin!", 400);
    }

    // Kiểm tra định dạng email
    if (!validateEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    // Kiểm tra độ dài password
    if (!validatePassword(password)) {
        throw appError("Mật khẩu phải có ít nhất 8 ký tự!", 400);
    }

    // Kiểm tra người dùng đã tồn tại chưa
    const userExist = await usersModel.findOne({ email });
    if (userExist) {
        throw appError("Người dùng đã tồn tại!", 400);
    }

    // Mã hóa password bằng bcrypt (10 rounds)
    const hashed = await bcrypt.hash(password, 10);

    // Tạo người dùng mới với role mặc định là 'user'
    const createUser = await usersModel.create({
        name,
        email,
        password: hashed,
        role: 'user'
    });

    // Tạo JWT tokens
    const accessToken = generateAccessToken(createUser._id);
    const refreshToken = generateRefreshToken(createUser._id);

    // Thiết lập cookie dựa trên môi trường (production vs development)
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,           // Chống tấn công XSS
        secure: isProduction,      // Chỉ HTTPS trong production
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });

    // Lưu refresh token vào database
    createUser.refreshToken = refreshToken;
    await createUser.save();

    // Trả về thông tin người dùng và access token (không trả password)
    return res.json({
        id: createUser._id,
        name: createUser.name,
        email: createUser.email,
        role: createUser.role,
        accessToken: accessToken,
        createdAt: createUser.createdAt
    });
};


/**
 * @desc Đăng nhập người dùng
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !password) {
        throw appError("Vui lòng nhập đầy đủ thông tin!", 400);
    }

    // Kiểm tra định dạng email
    if (!validateEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    // Tìm người dùng theo email
    const user = await usersModel.findOne({ email });
    if (!user) {
        throw appError("Email không tồn tại!", 401);
    }

    // So sánh password với password đã mã hóa trong database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw appError("Mật khẩu không đúng!", 401);
    }

    // Tạo JWT tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Cập nhật refresh token trong database
    user.refreshToken = refreshToken;
    await user.save();

    // Thiết lập cookie bảo mật dựa trên môi trường
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Trả về thông tin người dùng và access token
    return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: accessToken
    });
};

/**
 * @desc Đăng xuất người dùng
 * @route POST /api/auth/logout
 * @access Private (yêu cầu xác thực)
 */
export const logout = async (req, res) => {
    // Lấy user ID từ JWT token (được thiết lập bởi auth middleware)
    const userId = req.user._id;

    // Xóa refresh token khỏi database
    await usersModel.findByIdAndUpdate(userId, { refreshToken: "" });

    // Xóa refresh token cookie
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax"
    });

    return res.json({
        message: "Đăng xuất thành công!"
    });
};

/**
 * @desc Gửi OTP để đặt lại mật khẩu
 * @route POST /api/auth/forgot-password
 * @access Public
 */
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Kiểm tra email bắt buộc
    if (!email) {
        throw appError("Vui lòng nhập email!", 400);
    }

    // Kiểm tra định dạng email
    if (!validateEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    // Tìm người dùng theo email
    const user = await usersModel.findOne({ email });
    if (!user) {
        throw appError("Email không tồn tại!", 404);
    }

    // Tạo OTP 6 số bằng crypto (bảo mật hơn Math.random)
    const otp = crypto.randomInt(100000, 999999).toString();

    // Lưu OTP và thời hạn (10 phút) vào database
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Gửi OTP qua email
    await sendEmail({
        email: user.email,
        subject: "Cấp lại mật khẩu OTP",
        html: `
            <h3>Đặt lại mật khẩu</h3>
            <p>Mã OTP của bạn là:</p>
            <h1 style="color:red">${otp}</h1>
            <p>Mã có hiệu lực trong 10 phút</p>
        `
    });

    return res.json({
        message: `OTP đã được gửi đến email ${user.email}`
    });
};

/**
 * @desc Đặt lại mật khẩu bằng OTP
 * @route POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !otp || !password) {
        throw appError("Thiếu dữ liệu!", 400);
    }

    // Kiểm tra độ dài password
    if (!validatePassword(password)) {
        throw appError("Mật khẩu phải có ít nhất 8 ký tự!", 400);
    }

    // Tìm người dùng theo email
    const user = await usersModel.findOne({ email });

    if (!user) {
        throw appError("User not found!", 404);
    }

    // Xác thực OTP: kiểm tra sự tồn tại, giá trị và thời hạn
    if (
        !user.resetOtp ||
        user.resetOtp !== otp ||
        user.resetOtpExpire < Date.now()
    ) {
        throw appError("OTP không hợp lệ hoặc đã hết hạn!", 400);
    }

    // Mã hóa password mới
    const hashed = await bcrypt.hash(password, 10);

    // Cập nhật password và xóa các trường OTP
    user.password = hashed;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();

    return res.json({
        message: "Đặt lại mật khẩu thành công!"
    });
};

/**
 * @desc Làm mới token
 * @route POST /api/auth/refesh
 * @access Private
 */
export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw appError(" No resfesh token !", 401);
    };
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await usersModel.findById(decoded.id)
    if (!user || user.refreshToken !== refreshToken) {
        throw appError("Token không xác định ! ", 401);

    };
    const newAccessToken = generateAccessToken(user._id);
    return res.json({
        accessToken: newAccessToken
    });
};