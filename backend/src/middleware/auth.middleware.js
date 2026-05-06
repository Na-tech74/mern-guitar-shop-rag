import jwt from "jsonwebtoken";      // Giải mã và xác thực token
import User from "../models/users.model.js";  // Model User để lấy thông tin
import dotenv from 'dotenv';
import { appError } from "../common/appError.js";
dotenv.config();

export const protect = async (req, res, next) => {
  //debug
  // console.log("HEADER:", req.headers.authorization);
  // Bước 1: Lấy token từ header Authorization
  // Header thường có dạng: "Bearer eyJhbGciOiJIUzI1NiIs..."
  let token = req.headers.authorization;

  // Bước 2: Kiểm tra token có tồn tại và bắt đầu bằng "Bearer" không
  if (token && token.startsWith("Bearer")) {
    try {
      // Bước 3: Tách lấy phần token (bỏ "Bearer " đi)
      // "Bearer abc123xyz" -> "abc123xyz"
      token = token.split(" ")[1];

      // Bước 4: Giải mã và xác thực token
      // Nếu token hết hạn hoặc sai chữ ký -> throw error
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      // Bước 5: Tìm user trong database bằng id lấy từ token
      // .select("-password"): Không lấy field password (bảo mật)
      req.user = await User.findById(decoded.id).select("-password");

      // Bước 6: Chuyển sang middleware/route tiếp theo
      next();

    } catch (error) {
      // Token không hợp lệ (hết hạn, sai chữ ký, ...)
      throw appError("Not authorized, token failed", 401);
    }
  } else {
    // Không có token hoặc sai định dạng
    throw appError("Not authorized, no token", 401);
  }
};

export const adminOnly = (req, res, next) => {
  //debug
  // console.log("USER:", req.user);
  // console.log("ROLE:", JSON.stringify(req.user?.role));

  // Kiểm tra đã có user (sau khi qua protect) và role là "admin"
  if (req.user && req.user.role === "admin") {
    next();  // Là admin -> cho phép đi tiếp
  } else {
    // Không phải admin
    throw appError("Admin only", 403);
  }
};
