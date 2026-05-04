import jwt from "jsonwebtoken";

export const generateAccessToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: "15m"
        }
    );
};

export const generateRefreshToken = (id) => {
    return jwt.sign(
        { id }, // Payload - dữ liệu muốn lưu trong token
        process.env.JWT_REFRESH_SECRET, // Secret key - chữ ký bí mật
        {
            expiresIn: "7d" // Options - token hết hạn sau 7 ngày
        }
    );
};
