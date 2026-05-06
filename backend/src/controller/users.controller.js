import bcrypt from 'bcryptjs';
import { appError } from "../common/appError.js";
import usersModel from '../models/users.model.js';

/**LẤY DANH SÁCH TẤT CẢ NGƯỜI DÙNG */
export const getAllUser = async (req, res) => {

    // chỉ admin mới có quyền xem danh sách người dùng 
    if (req.user.role !== 'admin') {
        throw appError("Admin only!", 403); // 403: không có quyền
    };

    const findAllUser = await usersModel
        .find()
        .select("-password -refreshToken"); //không trả password
    return res.json(findAllUser);

};

/*LẤY DANH SÁCH NGƯỜI DÙNG THEO ID*/
export const getUserById = async (req, res) => {

    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw appError("Admin only!", 403); // 403: không có quyền
    }

    const findUserById = await usersModel
        .findById(id)
        // không trả về password và refreshToken để bảo mật thông tin người dùng
        .select("-password -refreshToken");
    if (!findUserById) {
        throw appError("User not found!", 404); // 404: không tìm thấy
    }
    return res.json(findUserById);

};


/* CẬP NHẬT NGƯỜI DÙNG*/
export const update = async (req, res) => {

    const { id } = req.params;
    const { name, email, password } = req.body;

    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        throw appError("Forbidden", 403);
    };

    // tìm người dùng theo id
    const user = await usersModel.findById(id);
    if (!user) {
        throw appError("User not found!", 404); // 404: không tìm thấy
    };

    // cập nhật lại các trường thông tin
    user.name = name || user.name;
    user.email = email || user.email;

    // kiểm tra và hash lại password
    if (password) {
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed
    };

    await user.save();

    return res.json({
        _id: user._id,
        name: user.name,
        email: user.email
    });
};

/*XÓA NGƯỜI DÙNG BẰNG ID*/
export const deleteUser = async (req, res) => {

    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw appError("Admin only!", 403); // 403: không có quyền
    };

    // chống tự xóa admin

    if (req.user._id.toString() === id) {
        throw appError("Cannot delete yourself", 403); // 403: không có quyền
    };

    //tìm người dùng theo id
    const findUser = await usersModel.findById(id);
    if (!findUser) {
        throw appError("User not found!", 404); // 404: không tìm thấy
    };

    // xóa người dùng 
    await usersModel.findByIdAndDelete(id);

    return res.json({
        message: "User deleted successfully!"
    });
};
