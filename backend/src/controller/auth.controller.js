/**
 * auth.controller.js
 * Xử lý các API liên quan đến xác thực người dùng: đăng ký, đăng nhập, đăng xuất, quên mật khẩu, đặt lại mật khẩu, làm mới token
 */

import bcrypt from "bcryptjs"; // Thư viện mã hóa mật khẩu (hash)
import crypto from "crypto"; // Thư viện tạo số ngẫu nhiên (OTP)
import jwt from "jsonwebtoken"; // Thư viện tạo/verify JSON Web Token

import User from "../models/users.model.js"; // Model User database

import { generateAccessToken, generateRefreshToken } from "../services/generateToken.js"; // Service tạo JWT
import { sendEmail } from "../services/sendEmail.js"; // Service gửi email

import { appError, appSuccess } from "../utils/appResponse.js"; // Utility xử lý response và lỗi
import {  isValidEmail,  isValidPassword, isValidObjectId } from "../utils/valid.js"; // Utility validate input
import { refreshTokenCookie, clearCookie } from "../utils/cookier.js"; // Utility xử lý cookie
import { sanitizeEmail, sanitizeText, formatDateTime } from "../utils/format.js";
import { create } from "domain";

/**
 * Đăng ký tài khoản mới
 * @param {string} name - Tên người dùng
 * @param {string} email - Email (validate: định dạng email)
 * @param {string} password - Mật khẩu (validate: 8 ký tự, chữ hoa/thường, số)
 * @throws {400} Thiếu thông tin | Email/Mật khẩu không hợp lệ
 * @throws {409} Email đã tồn tại
 * @returns {201} user + accessToken
 */
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate dữ liệu đầu vào
    if (!name || !email || !password) {
        throw appError("Vui lòng nhập đầy đủ thông tin!", 400);
    }

    if (!isValidEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    if (!isValidPassword(password)) {
        throw appError(
            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!",
            400
        );
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw appError("Người dùng đã tồn tại!", 409);
    }

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới trong database
    const newUser = await User.create({
        name: sanitizeText(name),
        email: sanitizeEmail(email),
        password: hashedPassword
    });

    // Tạo JWT tokens cho phiên đăng nhập
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    // Lưu refresh token và access token vào database để track phiên
    newUser.refreshToken = refreshToken;
    newUser.accessToken = accessToken;

    await newUser.save();

    // Gửi refresh token qua cookie HttpOnly
    refreshTokenCookie(res, refreshToken);

    // Trả về thông tin user và access token cho client
    return appSuccess(res, {
        statusCode: 201,
        message: "Đăng ký thành công!",
        data: {
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                createdAt: formatDateTime(newUser.createdAt),
                updatedAt: formatDateTime(newUser.updatedAt),
            },
            accessToken
        }
    });
};



/**
 * Đăng nhập
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @throws {400} Thiếu thông tin | Email không hợp lệ
 * @throws {401} Email/Mật khẩu không đúng
 * @returns {200} user + accessToken
 */
export const login = async (req, res) => {

    const { email, password } = req.body;

    // Validate dữ liệu đầu vào
    if (!email || !password) {
        throw appError("Vui lòng nhập đầy đủ thông tin!", 400);
    }

    if (!isValidEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    // Tìm user theo email (lấy thêm password & refreshToken để verify)
    const existingUser = await User.findOne({ email })
        .select("+password +refreshToken");

    if (!existingUser) {
        throw appError("Email hoặc mật khẩu không đúng!", 401);
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã hash trong database
    const isPasswordMatch = await bcrypt.compare(
        password,
        existingUser.password
    );

    if (!isPasswordMatch) {
        throw appError("Email hoặc mật khẩu không đúng!", 401);
    }

    // Tạo JWT tokens mới cho phiên đăng nhập
    const accessToken = generateAccessToken(existingUser._id);
    const refreshToken = generateRefreshToken(existingUser._id);

    // Cập nhật refresh token mới vào database (revoke token cũ)
    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    // Gửi refresh token qua cookie HttpOnly
    refreshTokenCookie(res, refreshToken);

    // Trả về thông tin user và access token
    return appSuccess(res, {
        statusCode: 200,
        message: "Đăng nhập thành công!",
        data: {
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                createdAt: formatDateTime(existingUser.createdAt),
                updatedAt: formatDateTime(existingUser.updatedAt),
            },
            accessToken
        }
    });
};


/**
 * Đăng xuất (yêu cầu auth middleware)
 * @requires req.user._id
 * @returns {200} message
 */
export const logout = async (req, res) => {
    const userId = req.user._id;

    // Xóa refresh token trong database (revoke session)
    await User.findByIdAndUpdate(userId, {
        refreshToken: ""
    });

    // Xóa refresh token cookie khỏi browser
    clearCookie(res);

    return appSuccess(res, {
        statusCode: 200,
        message: " Đăng xuất thành công!",
    })
};



/**
 * Gửi OTP đặt lại mật khẩu qua email
 * @param {string} email - Email người dùng
 * @throws {400} Thiếu email | Email không hợp lệ
 * @throws {404} Email không tồn tại
 * @returns {200} message
 */
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Validate email
    if (!email) {
        throw appError("Vui lòng nhập email!", 400);
    }

    if (!isValidEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    // Kiểm tra user tồn tại
    const existingUser = await User.findOne({ email })
        .select("+resetOtp +resetOtpExpire");

    if (!existingUser) {
        throw appError("Email không tồn tại!", 404);
    }

    // Tạo OTP 6 số ngẫu nhiên
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash OTP và lưu vào database cùng với thời hạn (10 phút)
    const hashedOtp = await bcrypt.hash(otp, 10);

    existingUser.resetOtp = hashedOtp;
    existingUser.resetOtpExpire = Date.now() + 10 * 60 * 1000;

    await existingUser.save();

    // Gửi OTP qua email cho user
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

    return appSuccess(res, {
        statusCode: 200,
        message: `OTP đã được gửi qua email ${existingUser.email}`
    })
};



/**
 * Đặt lại mật khẩu bằng OTP
 * @param {string} email - Email người dùng
 * @param {string} otp - Mã OTP (6 số, hiệu lực 10 phút)
 * @param {string} password - Mật khẩu mới
 * @throws {400} Thiếu dữ liệu | Email/Mật khẩu không hợp lệ | OTP không hợp lệ/hết hạn
 * @throws {404} Người dùng không tồn tại
 * @returns {200} message
 */
export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;

    // Validate dữ liệu đầu vào
    if (!email || !otp || !password) {
        throw appError("Thiếu dữ liệu!", 400);
    }

    if (!isValidEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    if (!isValidPassword(password)) {
        throw appError(
            "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số!",
            400
        );
    }

    // Tìm user và lấy các trường liên quan
    const existingUser = await User.findOne({ email })
        .select("+password +refreshToken +resetOtp +resetOtpExpire");

    if (!existingUser) {
        throw appError("Người dùng không tồn tại!", 404);
    }

    // Kiểm tra OTP đã hết hạn chưa
    if (
        !existingUser.resetOtp ||
        existingUser.resetOtpExpire < Date.now()
    ) {
        throw appError("OTP không hợp lệ hoặc đã hết hạn!", 400);
    }

    // So sánh OTP nhập vào với OTP đã hash
    const isOtpMatch = await bcrypt.compare(
        otp,
        existingUser.resetOtp
    );

    if (!isOtpMatch) {
        throw appError("OTP không hợp lệ hoặc đã hết hạn!", 400);
    }

    // Cập nhật mật khẩu mới (hash trước khi lưu)
    const hashedPassword = await bcrypt.hash(password, 10);

    existingUser.password = hashedPassword;

    // Xóa các trường OTP và refresh token cũ (bắt buộc đăng nhập lại)
    existingUser.resetOtp = "";
    existingUser.resetOtpExpire = 0;
    existingUser.refreshToken = "";

    await existingUser.save();

    // Xóa cookie refresh token
    clearCookie(res);

    return appSuccess(res, {
        statusCode: 200,
        message: "Thay đổi mật khẩu thành công!",
    })
};



/**
 * Làm mới access token bằng refresh token từ cookie
 * @requires req.cookies.refreshToken
 * @throws {401} Không tìm thấy | Không hợp lệ | Hết hạn refresh token
 * @throws {404} Người dùng không tồn tại
 * @returns {200} accessToken mới
 */
export const refreshAccessToken = async (req, res) => {
    // Lấy refresh token từ cookie
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
        throw appError("Không tìm thấy refresh token!", 401);
    }

    let decodedToken;

    // Verify refresh token (kiểm tra chữ ký và hạn)
    try {
        decodedToken = jwt.verify(
            oldRefreshToken,
            process.env.JWT_REFRESH_SECRET
        );
    } catch (error) {
        throw appError(
            "Token không hợp lệ hoặc đã hết hạn!",
            401
        );
    }

    // Tìm user và lấy refresh token trong database
    const existingUser = await User.findById(decodedToken._id)
        .select("+refreshToken");

    if (!existingUser) {
        throw appError("Người dùng không tồn tại!", 404);
    }

    // Kiểm tra refresh token có khớp với database không (phòng token bị đánh cắp)
    if (existingUser.refreshToken !== oldRefreshToken) {
        throw appError("Refresh token không hợp lệ!", 401);
    }

    // Tạo cặp token mới
    const newAccessToken = generateAccessToken(existingUser._id);
    const newRefreshToken = generateRefreshToken(existingUser._id);

    // Cập nhật refresh token mới vào database (rotate token)
    existingUser.refreshToken = newRefreshToken;

    await existingUser.save();

    // Gửi refresh token mới qua cookie
    refreshTokenCookie(res, newRefreshToken);

    // Trả về access token mới cho client
    return appSuccess(res, {
        statusCode: 200,
        message: "Refesh token thành công!",
        data: { accessToken: newAccessToken }
    });

};