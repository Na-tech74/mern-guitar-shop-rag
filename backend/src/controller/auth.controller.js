import usersModel from "../models/users.model.js";
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from "../services/generateToken.js";
import { sendEmail } from "../services/sendEmail.js";
import { appError } from "../common/appError.js";

/* ĐĂNG KÝ*/
export const register = async (req, res) => {

    const { name, email, password } = req.body;

    // kiểm tra nhập thông tin

    if (!name || !email || !password) {
        throw appError("Missing fields!", 400); // 400: thiếu dữ liệu
    }

    // kiểm tra password phải hơn 8 ký tự

    if (password.length < 8) {
        throw appError("The password must be 8 characters long!", 400); // 400: thiếu dữ liệu
    }

    // kiểm tra người dùng tồn tại 

    const userExist = await usersModel.findOne({ email });
    if (userExist) {
        throw appError("User already exists!", 400); // 400: thiếu dữ liệu (user đã tồn tại)
    }

    // hash pass
    const hashed = await bcrypt.hash(password, 10);

    // tạo user 
    const createUser = await usersModel.create({
        name, email, password: hashed
    });

    // tạo token 
    const accessToken = generateAccessToken(createUser._id);
    const refreshToken = generateRefreshToken(createUser._id);

    const isProduction = process.env.NODE_ENV === "production";
    
    // set cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,      //  chống XSS
        secure: isProduction, // true nếu dùng HTTPS
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });

    // lưu refersh token váo database
    createUser.refreshToken = refreshToken;

    await createUser.save();

    // reponse
    return res.json({
        _id: createUser._id,
        name: name,
        email: email,
        /*password: password.hashed,*/
        accessToken: accessToken,
        // refreshToken: refreshToken,
        createAt: createUser.createdAt
    });
};


/*ĐĂNG NHẬP */
export const login = async (req, res) => {

    const { email, password } = req.body;


    if (!email || !password) {
        throw appError("Missing fields!", 400); // 400: thiếu dữ liệu
    }

    // kiểm tra email đã đăng nhập chưa !

    const user = await usersModel.findOne({ email });
    if (!user) {
        throw appError("Invalid credentials!", 401); // 401: chưa auth
    }

    // kiểm tra mật khẩu 

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw appError("Invalid credentials!", 401); // 401: chưa auth
    }

    //tạo token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    // isProduction để set cookie secure và sameSite phù hợp với môi trường (production hay development) nhằm tăng cường bảo mật và tránh
    //  lỗi khi phát triển trên localhost.
    const isProduction = process.env.NODE_ENV === "production";
    // set cookie và trả về token
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });

    // trả về email và token khi đăng nhập thành công 
    return res.json({
        id: user._id,
        email: user.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
};

/* ĐĂNG XUẤT */
export const logout = async (req, res) => {

    const userId = req.user._id; // lấy từ JWT token
    const user = await usersModel.findById(userId, {
        // Chỉ cập nhật trường refreshToken, không cần lấy các trường khác
        refreshToken: ""
    });

    if (!user) {
        throw appError("User not found !", 404);
    }

    const isProduction = process.env.NODE_ENV === "production";
    //  xóa cookie
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: 0
    });
    return res.json({
        message: "Logout successful!"
    });
};

/* QUÊN MẬT KHẨU   */
export const forgotPassword = async (req, res) => {
    //debug
    // console.log("EMAIL:", req.body);
    // console.log(typeof randomBytes);

    const { email } = req.body;

    const user = await usersModel.findOne({ email });
    if (!user) {
        throw appError(" Email not found !", 404);
    };

    //Tạo otp 6 số 
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000 //10p

    await user.save();

    await sendEmail({
        email: user.email,
        subject: "Cấp lại mật khẩu  OTP",
        html: `
                <h3>Đặt lại mật khẩu</h3>
                <p>Mã OTP của bạn là:</p>
                <h1 style="color:red">${otp}</h1>
                <p>Mã có hiệu lực trong 10 phút</p>
            `
    });

    /*console.log("USER EMAIL:", user.email);
    console.log("EMAIL SENT:", info.response);*/

    return res.json({
        message: " OTP sent to email !"
    });
};

/* ĐẶT LẠI MẬT KHẨU */
export const resetPassword = async (req, res) => {


    const { email, otp, newPassword } = req.body;

    if (newPassword.length < 8) {
        throw appError("The new password must be at least 8 characters!", 400);
    };

    const user = await usersModel.findOne({ email });

    if (!user) {
        throw appError("User not found! ", 404);
    };

    // Kiểm tra OTP hợp lệ
    if (
        !user.resetOtp ||
        String(user.resetOtp).trim() !== String(otp).trim() ||
        user.resetOtpExpire < Date.now()
    ) {
        throw appError("OTP invalid or expired !", 400);
    };

    // Hash mật khẩu mới
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    //  Xóa OTP sau khi dùng (tránh dùng lại)
    user.resetOtp = "";
    user.resetOtpExpire = 0;

    await user.save();

    return res.json({
        message: "Password reset successful!"
    });
};