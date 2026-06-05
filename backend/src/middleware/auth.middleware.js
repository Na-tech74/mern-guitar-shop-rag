/**
 * auth.middleware.js
 * Middleware xử lý xác thực và phân quyền người dùng
 */

import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
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

/**
 * Middleware kiểm tra quyền admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 * @returns {void} Gọi next() nếu là admin, hoặc next(error) nếu không
 */
export const adminOnly = (req, res, next) => {
  // Kiểm tra user đã được xác thực (bởi protect middleware) và có role là admin
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    // Không có quyền admin
    return next(appError("Chỉ admin mới có quyền !", 403));
  }
};

/**
 * Rate limiter cho các endpoint xác thực (login, register, forgot-password, reset-password)
 * @param {number} windowMs - Thời gian tính theo miliseconds (mặc định 1 phút)
 * @param {number} max - Số request tối đa (mặc định 5)
 * @returns {Function} Express middleware rate limiter
 */
export const authLimiter = (windowMs = 60 * 1000, max = 5) => rateLimit({
  windowMs,
  max,
  handler: (req, res, next) => {
    return next(appError("Quá nhiều yêu cầu, vui lòng thử lại sau 1 phút!", 429));
  }
});

/**
 * Rate limiter cho endpoint refresh token
 * @param {number} windowMs - Thời gian tính theo miliseconds (mặc định 1 phút)
 * @param {number} max - Số request tối đa (mặc định 10)
 * @returns {Function} Express middleware rate limiter
 */
export const refreshLimiter = (windowMs = 60 * 1000, max = 10) => rateLimit({
  windowMs,
  max,
  handler: (req, res, next) => {
    return next(appError("Quá nhiều yêu cầu, vui lòng thử lại sau!", 429));
  }
});