import bcrypt from 'bcryptjs';
import { appError } from "../common/appError.js";
import { validateEmail, validatePassword } from '../utils/vaildate.js';
import usersModel from '../models/users.model.js';
/**
 * @desc Lấy danh sách tất cả người dùng
 * @route GET /api/users
 * @access Private (chỉ admin)
 */
export const getAllUser = async (req, res) => {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền", 403);
    }

    // Lấy tất cả người dùng (loại trừ password và refreshToken)
    const findAllUser = await usersModel
        .find()
        .select("-password -refreshToken");

    return res.json(findAllUser);
};

/**
 * @desc Lấy người dùng theo ID
 * @route GET /api/users/:id
 * @access Private (chỉ admin)
 */
export const getUserById = async (req, res) => {
    const { id } = req.params;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền", 403);
    }

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw appError("ID người dùng không hợp lệ!", 400);
    }

    // Tìm người dùng theo ID (loại trừ password và refreshToken)
    const findUserById = await usersModel
        .findById(id)
        .select("-password -refreshToken");

    // Kiểm tra người dùng tồn tại
    if (!findUserById) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    return res.json(findUserById);
};

/**
 * @desc Cập nhật thông tin người dùng
 * @route PUT /api/users/:id
 * @access Private (chính người dùng hoặc admin)
 */
export const update = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Kiểm tra quyền: chỉ người dùng đó hoặc admin mới được cập nhật
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        throw appError("Bạn không có quyền cập nhật người dùng này!", 403);
    }

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw appError("ID người dùng không hợp lệ!", 400);
    }

    // Tìm người dùng theo ID
    const user = await usersModel.findById(id);
    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    // Validate email format (nếu có thay đổi)
    if (email && email !== user.email) {
        if (!validateEmail(email)) {
            throw appError("Email không hợp lệ!", 400);
        }

        // Kiểm tra email đã được sử dụng chưa
        const emailExist = await usersModel.findOne({ email });
        if (emailExist) {
            throw appError("Email đã được sử dụng!", 400);
        }
    }

    // Validate password (nếu có thay đổi)
    if (password && !validatePassword(password)) {
        throw appError("Mật khẩu phải có ít nhất 8 ký tự!", 400);
    }

    // Cập nhật các trường thông tin
    if (name) user.name = name;
    if (email) user.email = email;

    // Nếu có password mới thì mã hóa và cập nhật
    if (password) {
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
    }

    await user.save();

    return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    });
};

/**
 * @desc Xóa người dùng theo ID
 * @route DELETE /api/users/:id
 * @access Private (chỉ admin)
 */
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw appError("ID người dùng không hợp lệ!", 400);
    }

    // Không cho phép admin tự xóa tài khoản của mình
    if (req.user._id.toString() === id) {
        throw appError("Không thể tự xóa tài khoản vì bạn là admin!", 403);
    }

    // Tìm người dùng theo ID
    const findUser = await usersModel.findById(id);
    if (!findUser) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    // Xóa người dùng
    await usersModel.findByIdAndDelete(id);

    return res.json({
        message: "Người dùng đã được xóa thành công!"
    });
};

/**
 * @desc Lấy thông tin người dùng hiện tại (profile)
 * @route GET /api/users/me
 * @access Private (đã đăng nhập)
 */
export const getMyProfile = async (req, res) => {
    const userId = req.user._id;

    // Lấy thông tin người dùng (loại trừ password và refreshToken)
    const user = await usersModel
        .findById(userId)
        .select("-password -refreshToken");

    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    return res.json(user);
};

/**
 * @desc Cập nhật mật khẩu người dùng hiện tại
 * @route PUT /api/users/change-password
 * @access Private (đã đăng nhập)
 */
export const changePassword = async (req, res) => {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!currentPassword || !newPassword) {
        throw appError("Vui lòng nhập mật khẩu hiện tại và mật khẩu mới!", 400);
    }

    // Validate password mới
    if (!validatePassword(newPassword)) {
        throw appError("Mật khẩu mới phải có ít nhất 8 ký tự!", 400);
    }

    // Tìm người dùng
    const user = await usersModel.findById(userId);
    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    // So sánh mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw appError("Mật khẩu hiện tại không đúng!", 401);
    }

    // Mã hóa và cập nhật mật khẩu mới
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // Xóa refresh token (buộc đăng nhập lại sau khi đổi mật khẩu)
    user.refreshToken = "";

    await user.save();

    return res.json({
        message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại."
    });
};