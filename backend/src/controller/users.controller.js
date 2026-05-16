import bcrypt from 'bcryptjs';
import { appError } from "../utils/appError.js";
import { isValidateEmail, isValidatePassword, isValidObjectId } from '../utils/vaildate.js';
import usersModel from '../models/users.model.js';

export const getAllUser = async (req, res) => {
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền", 403);
    }

    const findAllUser = await usersModel
        .find()
        .select("-password -refreshToken");

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

    const findUserById = await usersModel
        .findById(id)
        .select("-password -refreshToken");

    if (!findUserById) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    return res.json(findUserById);
};

export const update = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if ( req.user.role !== 'admin') {
        throw appError("Bạn không có quyền cập nhật người dùng này!", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID người dùng không hợp lệ!", 400);
    }

    const user = await usersModel.findById(id);
    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    if (!isValidateEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    const existingEmail = await usersModel.findOne({ email });
    if (existingEmail) {
        throw appError("Email đã được sử dụng!", 400);
    }

    if (!isValidatePassword(password)) {
        throw appError("Mật khẩu phải có ít nhất 8 ký tự!", 400);
    }

    if (password) {
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
    }

    if (role && req.user.role === 'admin') {
        user.role = role;
    }

    await user.save();

    return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
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

    if (!isValidatePassword(newPassword)) {
        throw appError("Mật khẩu mới phải có ít nhất 8 ký tự!", 400);
    }

    const user = await usersModel.findById(userId);
    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw appError("Mật khẩu hiện tại không đúng!", 401);
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    user.refreshToken = "";

    await user.save();

    return res.json({
        message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại."
    });
};