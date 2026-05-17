import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

import { generateAccessToken, generateRefreshToken } from "../services/generateToken.js";
import { sendEmail } from "../services/sendEmail.js";

import { appError } from "../utils/appError.js";
import { isValidateEmail, isValidatePassword } from "../utils/vaildate.js";
import { refreshTokenCookie, clearCookie } from "../utils/cookier.js";



// ================= REGISTER =================

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw appError("Vui lòng nhập đầy đủ thông tin!", 400);
    }

    if (!isValidateEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    if (!isValidatePassword(password)) {
        throw appError(
            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!",
            400
        );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw appError("Email đã tồn tại!", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const accessToken = generateAccessToken(createdUser._id);
    const refreshToken = generateRefreshToken(createdUser._id);

    createdUser.refreshToken = refreshToken;

    await createdUser.save();

    refreshTokenCookie(res, refreshToken);

    return res.status(201).json({
        message: "Đăng ký thành công!",
        user: {
            id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role
        },
        accessToken
    });
};



// ================= LOGIN =================

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw appError("Vui lòng nhập đầy đủ thông tin!", 400);
    }

    if (!isValidateEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    const existingUser = await User.findOne({ email })
        .select("+password +refreshToken");

    if (!existingUser) {
        throw appError("Email hoặc mật khẩu không đúng!", 401);
    }

    const isPasswordMatch = await bcrypt.compare(
        password,
        existingUser.password
    );

    if (!isPasswordMatch) {
        throw appError("Email hoặc mật khẩu không đúng!", 401);
    }

    const accessToken = generateAccessToken(existingUser._id);
    const refreshToken = generateRefreshToken(existingUser._id);

    existingUser.refreshToken = refreshToken;

    await existingUser.save();

    refreshTokenCookie(res, refreshToken);

    return res.status(200).json({
        message: "Đăng nhập thành công!",
        user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role
        },
        accessToken
    });
};



// ================= LOGOUT =================

export const logout = async (req, res) => {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
        refreshToken: ""
    });

    clearCookie(res);

    return res.status(200).json({
        message: "Đăng xuất thành công!"
    });
};



// ================= FORGOT PASSWORD =================

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw appError("Vui lòng nhập email!", 400);
    }

    if (!isValidateEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    const existingUser = await User.findOne({ email })
        .select("+resetOtp +resetOtpExpire");

    if (!existingUser) {
        throw appError("Email không tồn tại!", 404);
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    existingUser.resetOtp = hashedOtp;
    existingUser.resetOtpExpire = Date.now() + 10 * 60 * 1000;

    await existingUser.save();

    await sendEmail({
        email: existingUser.email,
        subject: "OTP Đặt Lại Mật Khẩu",
        html: `
            <h2>Đặt lại mật khẩu</h2>
            <p>Mã OTP của bạn là:</p>
            <h1>${otp}</h1>
            <p>OTP có hiệu lực trong 10 phút.</p>
        `
    });

    return res.status(200).json({
        message: "OTP đã được gửi qua email!"
    });
};



// ================= RESET PASSWORD =================

export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
        throw appError("Thiếu dữ liệu!", 400);
    }

    if (!isValidateEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    if (!isValidatePassword(password)) {
        throw appError(
            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!",
            400
        );
    }

    const existingUser = await User.findOne({ email })
        .select("+password +refreshToken +resetOtp +resetOtpExpire");

    if (!existingUser) {
        throw appError("Người dùng không tồn tại!", 404);
    }

    if (
        !existingUser.resetOtp ||
        existingUser.resetOtpExpire < Date.now()
    ) {
        throw appError("OTP không hợp lệ hoặc đã hết hạn!", 400);
    }

    const isOtpMatch = await bcrypt.compare(
        otp,
        existingUser.resetOtp
    );

    if (!isOtpMatch) {
        throw appError("OTP không hợp lệ hoặc đã hết hạn!", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    existingUser.password = hashedPassword;
    existingUser.resetOtp = "";
    existingUser.resetOtpExpire = 0;
    existingUser.refreshToken = "";

    await existingUser.save();

    clearCookie(res);

    return res.status(200).json({
        message: "Đặt lại mật khẩu thành công!"
    });
};



// ================= REFRESH ACCESS TOKEN =================

export const refreshAccessToken = async (req, res) => {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
        throw appError("Không tìm thấy refresh token!", 401);
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            oldRefreshToken,
            process.env.JWT_REFRESH_SECRET
        );
    } catch (error) {
        throw appError(
            "Refresh token không hợp lệ hoặc đã hết hạn!",
            401
        );
    }

    const existingUser = await User.findById(decodedToken.id)
        .select("+refreshToken");

    if (!existingUser) {
        throw appError("Người dùng không tồn tại!", 404);
    }

    if (existingUser.refreshToken !== oldRefreshToken) {
        throw appError("Refresh token không hợp lệ!", 401);
    }

    const newAccessToken = generateAccessToken(existingUser._id);
    const newRefreshToken = generateRefreshToken(existingUser._id);

    existingUser.refreshToken = newRefreshToken;

    await existingUser.save();

    refreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({
        accessToken: newAccessToken
    });
};