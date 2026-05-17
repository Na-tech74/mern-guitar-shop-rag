import bcrypt from 'bcryptjs';
import { appError } from "../utils/appError.js";
import { isValidateEmail, isValidatePassword, isValidObjectId } from '../utils/vaildate.js';
import usersModel from '../models/users.model.js';

export const getAllUser = async (req, res) => {

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền", 403);
    }

    const findAllUser = await usersModel.find().select("-password -refreshToken");

    return res.json(findAllUser);
};

export const getUserById = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID người dùng không hợp lệ!", 400);
    }

    const findUserById = await usersModel.findById(id).select("-password -refreshToken");

    if (!findUserById) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    return res.json(findUserById);
};

export const updateUser = async (req, res) => {

    const { id } = req.params;

    const { name, email, password, role } = req.body;

    if (req.user.role !== "admin") {
        throw appError("Bạn không có quyền!", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID không hợp lệ!", 400);
    }

    const user = await usersModel
        .findById(id)
        .select("+password");

    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    if (name) {
        user.name = name;
    }

    if (email) {

        if (!isValidateEmail(email)) {
            throw appError("Email không hợp lệ!", 400);
        }

        const existingUser = await usersModel.findOne({ email });

        if (
            existingUser &&
            existingUser._id.toString() !== id
        ) {
            throw appError("Email đã tồn tại!", 400);
        }

        user.email = email;
    }

    if (password) {

        if (!isValidatePassword(password)) {
            throw appError(
                "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số!",
                400
            );
        }

        user.password = await bcrypt.hash(password, 10);
    }

    if (role) {

        const allowedRoles = ["user", "admin"];

        if (!allowedRoles.includes(role)) {
            throw appError("Role không hợp lệ!", 400);
        }

        user.role = role;
    }

    await user.save();

    return res.json({
        message: "Cập nhật thành công!",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID người dùng không hợp lệ!", 400);
    }

    if (req.user._id.toString() === id) {
        throw appError("Không thể tự xóa tài khoản vì bạn là admin!", 403);
    }

    const findUser = await usersModel.findById(id);
    if (!findUser) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    await usersModel.findByIdAndDelete(id);

    return res.json({
        message: "Người dùng đã được xóa thành công!"
    });
};

export const getMyProfile = async (req, res) => {
    const userId = req.user._id;

    const user = await usersModel
        .findById(userId)
        .select("-password -refreshToken");

    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    return res.json(user);
};

export const changePassword = async (req, res) => {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw appError("Vui lòng nhập mật khẩu hiện tại và mật khẩu mới!", 400);
    }

    if (newPassword && !isValidatePassword(newPassword)) {
        throw appError("Mật khẩu mới phải có ít nhất 8 ký tự!", 400);
    }

    const user = await usersModel.findById(userId);
    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }
    // Kiểm tra mật khẩu check mật khẫu người dùng so với mật khẩu DB
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw appError("Mật khẩu hiện tại không đúng!", 401);
    }
    //  khi mật khẩu đúng thì hasd mật khẩu mới và lưu vào database
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    
    // xóa token cũ để vô hiệu hóa phiên đăng nhập cũ
    user.refreshToken = "";

    await user.save();

    return res.json({
        message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại."
    });
};