import usersModel from "../models/users.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { generateAccessToken, generateRefreshToken } from "../services/generateToken.js";
import { sendEmail } from "../services/sendEmail.js";
import { appError } from "../utils/appError.js";
import { isValidateEmail, isValidatePassword } from "../utils/vaildate.js"
import { refreshTokenCookie, clearCookie } from "../utils/cookier.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw appError("Vui lòng nhập đầy đủ thông tin!", 400);
    }

    if (!isValidateEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    if (!isValidatePassword(password)) {
        throw appError("Mật khẩu phải có ít nhất 8 ký tự!", 400);
    }

    const existingUser = await usersModel.findOne({ email });
    if (existingUser) {
        throw appError("Người dùng đã tồn tại!", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await usersModel.create({
        name,
        email,
        password: hashedPassword,
        role: 'user'
    });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    refreshTokenCookie(res, refreshToken);

    newUser.refreshToken = refreshToken;
    await newUser.save();

    return res.json({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        accessToken: accessToken,
        createdAt: newUser.createdAt
    });
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw appError("Vui lòng nhập đầy đủ thông tin!", 400);
    }

    if (!isValidateEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    const user = await usersModel.findOne({ email });
    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if (!user || !passwordIsMatch) {
        throw appError("Email hoặc mật khẩu không đúng!", 401);
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    refreshTokenCookie(res, refreshToken);

    return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken: accessToken
    });
};

export const logout = async (req, res) => {
    const userId = req.user._id;

    await usersModel.findByIdAndUpdate(userId, { refreshToken: "" });

    clearCookie(res);

    return res.json({
        message: "Đăng xuất thành công!"
    });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw appError("Vui lòng nhập email!", 400);
    }

    if (!isValidateEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    const user = await usersModel.findOne({ email });
    if (!user) {
        throw appError("Email không tồn tại!", 404);
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    user.resetOtp = hashedOtp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

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

export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
        throw appError("Thiếu dữ liệu!", 400);
    }

    if (!isValidatePassword(password)) {
        throw appError("Mật khẩu phải có ít nhất 8 ký tự!", 400);
    }

    const user = await usersModel.findOne({ email });

    if (!user) {
        throw appError("Người dùng không tồn tại!", 404);
    }

    const otpIsMatch = await bcrypt.compare(otp, user.resetOtp);
    if (!user.resetOtp || user.resetOtpExpire < Date.now() || !otpIsMatch) {
        throw appError("OTP không hợp lệ hoặc đã hết hạn!", 400);
    }

    const hashedNewPassword = await bcrypt.hash(password, 10);

    user.password = hashedNewPassword;
    user.resetOtp = undefined;
    user.resetOtpExpire = undefined;

    await user.save();

    return res.json({
        message: "Đặt lại mật khẩu thành công!"
    });
};

export const refreshToken = async (req, res) => {

    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
        throw appError("Không thể làm mới Token!", 401);
    }

    let decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
        throw appError("Token không hợp lệ hoặc đã hết hạn!", 401);
    }

    const user = await usersModel.findById(decoded.id)
    if (!user || user.refreshToken !== oldRefreshToken) {
        throw appError("Token không xác định!", 401);
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    refreshTokenCookie(res, newRefreshToken);

    return res.json({
        accessToken: newAccessToken
    });
};