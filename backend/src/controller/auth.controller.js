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
        throw appError("Vui lòng nhập đầy đủ thông tin!", 400); // 400: thiếu dữ liệu
    }

    // kiểm tra email hợp lệ 
    if (email && !email.includes("@gmail.com")) {
        throw appError("Email không hợp lệ!", 400); // 400: thiếu dữ liệu
    }

    // kiểm tra password phải hơn 8 ký tự
    if (password.length < 8) {
        throw appError(" Mật khẩu phải có ít nhất 8 ký tự!", 400); // 400: thiếu dữ liệu
    }

    // kiểm tra người dùng tồn tại 
    const userExist = await usersModel.findOne({ email });
    if (userExist) {
        throw appError("Người dùng đã tồn tại!", 400); // 400: thiếu dữ liệu (user đã tồn tại)
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

    // isProduction để set cookie secure và sameSite phù hợp với môi trường (production hay development) nhằm tăng cường bảo mật và tránh
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

        /*Không trả về mật khẩu đã hash, 
         nhưng nếu cần thì có thể bao gồm nó ở đây.*/
        /*password: password.hashed,*/

        accessToken: accessToken,

        /*Nếu muốn trả về refreshToken trong response body 
        (thường không cần thiết vì đã set cookie), có thể thêm dòng dưới đây:*/
        // refreshToken: refreshToken,

        createAt: createUser.createdAt
    });
};


/*ĐĂNG NHẬP */
export const login = async (req, res) => {

    const { email, password } = req.body;
    // kiểm tra nhập thông tin
    if (!email || !password) {
        throw appError("Vui lòng nhập đầy đủ thông tin!", 400); // 400: thiếu dữ liệu
    }

    // kiểm tra email hợp lệ
    if (email && !email.includes("@gmail.com")) {
        throw appError("Email không hợp lệ!", 400); // 400: thiếu dữ liệu
    }

    // kiểm tra email đã đăng nhập chưa !
    const user = await usersModel.findOne({ email });
    if (!user) {
        throw appError("Email không tồn tại!", 401); // 401: chưa auth
    }

    // kiểm tra mật khẩu đúng hay không (so sánh với mật khẩu đã hash trong database)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw appError("Mật khẩu không đúng!", 401); // 401: chưa auth
    }

    //tạo token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    const isProduction = process.env.NODE_ENV === "production";

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
        role: user.role
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
        throw appError(" Không tìm thấy người dùng !", 404);
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
        message: " Đăng xuất thành công!"
    });
};

/* QUÊN MẬT KHẨU   */
export const forgotPassword = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        throw appError("Vui lòng nhập email!", 400);
    };

    const user = await usersModel.findOne({ email });
    if (!user) {
        throw appError(" Email không tồn tại !", 404);
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

    return res.json({
        message: `OTP đã được gửi đến email ${user.email} !`
    });
};

/* ĐẶT LẠI MẬT KHẨU */
export const resetPassword = async (req, res) => {

    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
        throw appError("Thiếu dữ liệu!", 400);
    };

    if (password.length < 8) {
        throw appError(" Mật khẩu phải có ít nhất 8 ký tự!", 400);
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
        throw appError("OTP không hợp lệ hoặc đã hết hạn!", 400);
    };

    // Hash mật khẩu mới
    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;

    //  Xóa OTP sau khi dùng (tránh dùng lại)
    user.resetOtp = "";
    user.resetOtpExpire = 0;

    await user.save();

    return res.json({
        message: "Đặt lại mật khẩu thành công!"
    });
};