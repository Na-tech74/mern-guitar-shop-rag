/**
 * users.controller.js
 * Xử lý các API liên quan đến người dùng: lấy danh sách, chi tiết,
 * cập nhật, xóa, profile cá nhân, đổi mật khẩu, upload avatar.
 */

import bcrypt from 'bcryptjs';
import { appError, appSuccess } from "../utils/appResponse.js";
import { isValidEmail, isValidPassword, isValidObjectId } from '../utils/valid.js';
import User from '../models/users.model.js';
import { formatDateTime } from '../utils/format.js';
import { uploadImages } from '../services/uploadImages.js';

/**
 * Lấy danh sách tất cả người dùng (chỉ admin)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {200} Danh sách người dùng
 */
export const getAllUser = async (req, res) => {
    const findAllUser = await User.find().select("-password -refreshToken");

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh sách người dùng thành công!",
        data: findAllUser
    });
};

/**
 * Lấy thông tin người dùng theo ID (chỉ admin)
 * @param {Object} req - Request object chứa id trong params
 * @param {Object} res - Response object
 * @throws {400} ID không hợp lệ
 * @throws {404} Không tìm thấy người dùng
 * @returns {200} Thông tin người dùng
 */
export const getUserById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID người dùng không hợp lệ!", 400);
    }

    const findUserById = await User.findById(id).select("-password -refreshToken");

    if (!findUserById) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy thông tin người dùng thành công!",
        data: findUserById
    });
};

/**
 * Cập nhật thông tin người dùng (chỉ admin)
 * @param {Object} req - Request object chứa id trong params và dữ liệu cập nhật trong body
 * @param {Object} res - Response object
 * @throws {400} ID không hợp lệ | Email không hợp lệ | Email đã tồn tại | Mật khẩu không hợp lệ | Role không hợp lệ
 * @throws {404} Không tìm thấy người dùng
 * @returns {200} Thông tin đã cập nhật
 */
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    if (!isValidObjectId(id)) {
        throw appError("ID không hợp lệ!", 400);
    }

    const user = await User
        .findById(id)
        .select("+password");

    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    if (name) {
        user.name = name;
    }

    if (email && !isValidEmail(email)) {
        throw appError("Email không hợp lệ!", 400);
    }

    const dup = email ? await User.findOne({ email }) : null;
    if (email && dup && dup._id.toString() !== id) {
        throw appError("Email đã tồn tại!", 400);
    }

    if (email) {
        user.email = email;
    }

    if (password && !isValidPassword(password)) {
        throw appError("Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số!", 400);
    }
    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    if (role) {
        const allowedRoles = ["customer", "staff", "admin"];
        if (!allowedRoles.includes(role)) {
            throw appError("Role không hợp lệ!", 400);
        }
        user.role = role;
    }

    await user.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật thành công!",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createAt: formatDateTime(user.createdAt),
            updatedAt: formatDateTime(user.updatedAt),
        }
    });
};

/**
 * Xóa người dùng theo ID (chỉ admin)
 * @param {Object} req - Request object chứa id trong params
 * @param {Object} res - Response object
 * @throws {400} ID không hợp lệ
 * @throws {403} Không thể tự xóa tài khoản admin
 * @throws {404} Không tìm thấy người dùng
 * @returns {200} Thông báo xóa thành công
 */
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(id)) {
        throw appError("ID người dùng không hợp lệ!", 400);
    }

    if (userId.toString() === id) {
        throw appError("Không thể tự xóa tài khoản vì bạn là admin!", 403);
    }

    const findUser = await User.findById(id);
    if (!findUser) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    await User.findByIdAndDelete(id);

    return appSuccess(res, {
        statusCode: 200,
        message: "Người dùng đã được xóa thành công!"
    });
};

/**
 * Lấy thông tin profile của người dùng hiện tại
 * @param {Object} req - Request object chứa thông tin user từ token
 * @param {Object} res - Response object
 * @throws {404} Không tìm thấy người dùng
 * @returns {200} Thông tin profile
 */
export const getMyProfile = async (req, res) => {
    const userId = req.user._id;

    const user = await User
        .findById(userId)
        .select("-password -refreshToken");

    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy thông tin người dùng thành công!",
        data: user
    });
};

/**
 * Cập nhật profile của người dùng hiện tại
 * @param {Object} req - Request object chứa thông tin user từ token và name/email trong body
 * @param {Object} res - Response object
 * @throws {400} Email không hợp lệ | Email đã tồn tại
 * @throws {404} Không tìm thấy người dùng
 * @returns {200} Thông tin đã cập nhật
 */
export const updateMyProfile = async (req, res) => {
    const userId = req.user._id;
    const { name, email } = req.body;

    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    if (name) {
        user.name = name;
    }

    if (email) {
        if (!isValidEmail(email)) {
            throw appError("Email không hợp lệ!", 400);
        }
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            throw appError("Email đã tồn tại!", 400);
        }
        user.email = email;
    }

    await user.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật thông tin thành công!",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || "",
            createdAt: formatDateTime(user.createdAt),
            updatedAt: formatDateTime(user.updatedAt),
        }
    });
}

/**
 * Thay đổi mật khẩu của người dùng hiện tại
 * @param {Object} req - Request object chứa currentPassword và newPassword trong body
 * @param {Object} res - Response object
 * @throws {400} Thiếu thông tin | Mật khẩu mới không hợp lệ
 * @throws {401} Mật khẩu hiện tại không đúng
 * @throws {404} Không tìm thấy người dùng
 * @returns {200} Thông báo đổi mật khẩu thành công
 */
export const changePassword = async (req, res) => {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw appError("Vui lòng nhập mật khẩu hiện tại và mật khẩu mới!", 400);
    }

    if (newPassword && !isValidPassword(newPassword)) {
        throw appError("Mật khẩu mới phải có ít nhất 8 ký tự!", 400);
    }

    const user = await User.findById(userId).select("+password");
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

    return appSuccess(res, {
        statusCode: 200,
        message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại."
    });
};

/**
 * Upload avatar cho người dùng hiện tại
 * @param {Object} req - Request chứa file ảnh trong req.file (field name: "avatar")
 * @param {Object} res - Response object
 * @throws {400} Không có file ảnh
 * @throws {404} Không tìm thấy người dùng
 * @returns {200} URL avatar mới
 */
export const uploadMyAvatar = async (req, res) => {

    const userId = req.user._id;
    const imageFile = req.file;

    if (!imageFile) {
        throw appError("Vui lòng chọn file ảnh để tải lên!", 400);
    }

    const urls = await uploadImages([imageFile], "avatars");

    const user = await User
        .findById(userId)
        .select("-password -refreshToken");
    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    user.avatar = urls[0];
    await user.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật ảnh đại diện thành công!",
        data: {
            avatar: user.avatar,
        },
    });
};

/**
 * Xóa avatar của người dùng hiện tại
 * @param {Object} req - Request object chứa thông tin user từ token
 * @param {Object} res - Response object
 * @throws {404} Không tìm thấy người dùng
 * @returns {200} Thông báo xóa avatar thành công
 */
export const deleteMyAvatar = async (req, res) => {
    const userId = req.user._id;

    const user = await User
        .findById(userId)
        .select("-password -refreshToken");
    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    user.avatar = "";
    await user.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Đã xóa ảnh đại diện!",
        data: {
            avatar: "",
        },
    });
};
