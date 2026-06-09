import bcrypt from 'bcryptjs';
import { appError, appSuccess } from "../utils/appResponse.js";
import { isValidEmail, isValidPassword, isValidObjectId } from '../utils/valid.js';
import usersModel from '../models/users.model.js';
import { formatDateTime } from '../utils/format.js';
import { uploadImages } from '../services/uploadImages.js';

/**
 * Lấy danh sách tất cả người dùng (chỉ admin)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getAllUser = async (req, res) => {
    // Lấy tất cả người dùng, loại bỏ password và refreshToken
    const findAllUser = await usersModel.find().select("-password -refreshToken");

    // Trả về danh sách người dùng
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
 */
export const getUserById = async (req, res) => {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ
    if (!isValidObjectId(id)) {
        throw appError("ID người dùng không hợp lệ!", 400);
    }

    // Tìm người dùng theo ID
    const findUserById = await usersModel.findById(id).select("-password -refreshToken");

    // Kiểm tra người dùng tồn tại
    if (!findUserById) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    // Trả về thông tin người dùng
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
 */
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    // Kiểm tra ID hợp lệ
    if (!isValidObjectId(id)) {
        throw appError("ID không hợp lệ!", 400);
    }

    // Tìm người dùng cần cập nhật (bao gồm password để kiểm tra)
    const user = await usersModel
        .findById(id)
        .select("+password");

    // Kiểm tra người dùng tồn tại
    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    // Cập nhật tên nếu được cung cấp
    if (name) {
        user.name = name;
    }

    // Cập nhật email nếu được cung cấp
    if (email) {
        // Kiểm tra định dạng email
        if (!isValidEmail(email)) {
            throw appError("Email không hợp lệ!", 400);
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await usersModel.findOne({ email });

        if (
            existingUser &&
            existingUser._id.toString() !== id
        ) {
            throw appError("Email đã tồn tại!", 400);
        }

        user.email = email;
    }

    // Cập nhật mật khẩu nếu được cung cấp
    if (password) {
        // Kiểm tra định dạng mật khẩu
        if (!isValidPassword(password)) {
            throw appError(
                "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số!",
                400
            );
        }

        // Mã hóa mật khẩu mới
        user.password = await bcrypt.hash(password, 10);
    }

    // Cập nhật role nếu được cung cấp
    if (role) {
        const allowedRoles = ["user", "admin"];

        // Kiểm tra role hợp lệ
        if (!allowedRoles.includes(role)) {
            throw appError("Role không hợp lệ!", 400);
        }

        user.role = role;
    }

    // Lưu thay đổi vào database
    await user.save();

    // Trả về thông tin người dùng đã cập nhật
    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật thành công!",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createAt:formatDateTime(user.createdAt),
            updatedAt: formatDateTime(user.updatedAt),
        }
    });
};

/**
 * Xóa người dùng theo ID (chỉ admin)
 * @param {Object} req - Request object chứa id trong params
 * @param {Object} res - Response object
 */
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ
    if (!isValidObjectId(id)) {
        throw appError("ID người dùng không hợp lệ!", 400);
    }

    // Không cho phép admin tự xóa tài khoản của mình
    if (req.user._id.toString() === id) {
        throw appError("Không thể tự xóa tài khoản vì bạn là admin!", 403);
    }

    // Tìm người dùng cần xóa
    const findUser = await usersModel.findById(id);
    if (!findUser) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    // Xóa người dùng khỏi database
    await usersModel.findByIdAndDelete(id);

    // Trả về kết quả thành công
    return appSuccess(res, {
        statusCode: 200,
        message: "Người dùng đã được xóa thành công!"
    });
};

/**
 * Lấy thông tin profile của người dùng hiện tại
 * @param {Object} req - Request object chứa thông tin user từ token
 * @param {Object} res - Response object
 */
export const getMyProfile = async (req, res) => {
    // Lấy ID người dùng từ token đã xác thực
    const userId = req.user._id;

    // Tìm thông tin người dùng
    const user = await usersModel
        .findById(userId)
        .select("-password -refreshToken");

    // Kiểm tra người dùng tồn tại
    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    // Trả về thông tin profile
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy thông tin người dùng thành công!",
        data: user
    });
};

/**
 * Cập nhật profile của người dùng hiện tại
 * @param {Object} req - Request object chứa thông tin user từ token
 * @param {string} req.body.name - Tên mới (tùy chọn)
 * @param {string} req.body.email - Email mới (tùy chọn)
 * @returns {200} Thông tin người dùng đã cập nhật
 */
export const updateMyProfile = async (req, res) => {
    const userId = req.user._id;
    const { name, email } = req.body;

    const user = await usersModel.findById(userId).select("-password -refreshToken");
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
        const existingUser = await usersModel.findOne({ email });
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
};

/**
 * Thay đổi mật khẩu của người dùng hiện tại
 * @param {Object} req - Request object chứa currentPassword và newPassword
 * @param {Object} res - Response object
 */
export const changePassword = async (req, res) => {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    // Kiểm tra đã nhập đầy đủ thông tin
    if (!currentPassword || !newPassword) {
        throw appError("Vui lòng nhập mật khẩu hiện tại và mật khẩu mới!", 400);
    }

    // Kiểm tra định dạng mật khẩu mới
    if (newPassword && !isValidPassword(newPassword)) {
        throw appError("Mật khẩu mới phải có ít nhất 8 ký tự!", 400);
    }

    // Tìm người dùng trong database
    const user = await usersModel.findById(userId).select("+password");
    if (!user) {
        throw appError("Không tìm thấy người dùng!", 404);
    }

    // So sánh mật khẩu hiện tại với mật khẩu trong database
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw appError("Mật khẩu hiện tại không đúng!", 401);
    }

    // Mã hóa mật khẩu mới và lưu vào database
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // Xóa token cũ để vô hiệu hóa phiên đăng nhập cũ
    user.refreshToken = "";

    // Lưu thay đổi
    await user.save();

    // Trả về kết quả thành công
    return appSuccess(res, {
        statusCode: 200,
        message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại."
    });
};

/**
 * Upload avatar cho người dùng hiện tại
 * @param {Object} req - Request chứa file ảnh trong req.file (field name: "avatar")
 * @returns {200} URL avatar mới
 */
export const uploadMyAvatar = async (req, res) => {
    if (!req.file) {
        throw appError("Vui lòng chọn file ảnh để tải lên!", 400);
    }

    const urls = await uploadImages([req.file], "avatars");

    const user = await usersModel
        .findById(req.user._id)
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
 */
export const deleteMyAvatar = async (req, res) => {
    const user = await usersModel
        .findById(req.user._id)
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