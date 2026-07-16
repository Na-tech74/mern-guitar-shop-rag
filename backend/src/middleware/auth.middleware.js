/**
 * auth.middleware.js
 * Middleware xử lý xác thực và phân quyền người dùng
 */

import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import { appError } from "../utils/appResponse.js";

/**
 * Middleware bảo vệ route - kiểm tra token xác thực
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void} Gọi next() nếu token hợp lệ, hoặc next(error) nếu không hợp lệ
 */
export const protect = async (req, res, next) => {
  // Lấy token từ header Authorization
  let token = req.headers.authorization;

  // Kiểm tra token có tồn tại và bắt đầu bằng "Bearer"
  if (token && token.startsWith("Bearer")) {
    try {
      // Lấy phần token sau "Bearer "
      token = token.split(" ")[1];

      // Giải mã token bằng JWT_ACCESS_SECRET
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // Tìm user trong database dựa trên id trong token
      // Loại bỏ password khỏi kết quả
      req.user = await User.findById(decoded.id).select("-password");

      // Token hợp lệ, chuyển sang middleware/route tiếp theo
      next();

    } catch (error) {
      // Token không hợp lệ hoặc đã hết hạn
      return next(appError("Không thể xác thực token !", 401));
    }
  } else {
    // Không có token trong request
    return next(appError("Không được ủy quyền, không có token !", 401));
  }
};
export const staff = (req, res, next) => {
  if (req.user && req.user.role === "staff") {
    next();
  } else {
    return next(appError("Chỉ nhân viên mới có quyền !", 403));
  }
};

/**
 * Middleware kiểm tra quyền staff hoặc admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void} Gọi next() nếu là staff hoặc admin, hoặc next(error) nếu không
 */
export const staffOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "staff" || req.user.role === "admin")) {
    next();
  } else {
    return next(appError("Bạn không có quyền thực hiện hành động này !", 403));
  }
};

/**
 * Middleware kiểm tra quyền admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void} Gọi next() nếu là admin, hoặc next(error) nếu không
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next(appError("Chỉ quản trị viên mới có quyền !", 403));
  }
};

