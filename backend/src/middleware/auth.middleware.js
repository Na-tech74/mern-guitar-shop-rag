import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import dotenv from 'dotenv';
import { appError } from "../utils/appError.js";
dotenv.config();

export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();

    } catch (error) {
      throw appError("Không thể xác thực token !", 401);
    }
  } else {
    throw appError("Không được ủy quyền, không có token !", 401);
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    throw appError("Chỉ admin mới có quyền !", 403);
  }
};
