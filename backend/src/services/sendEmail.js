/**
 * sendEmail.js
 * Service gửi email sử dụng Nodemailer với Gmail SMTP
 */

import nodemailer from "nodemailer"; // Thư viện gửi email
import dotenv from 'dotenv';
import { appError } from "../utils/appResponse.js"; // Utility xử lý lỗi

dotenv.config();

// Cấu hình transporter với Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Email gửi
        pass: process.env.EMAIL_PASS  // App password (không phải password đăng nhập)
    }
});

/**
 * Gửi email
 * @param {object} options - { email, subject, html }
 * @param {string} options.email - Email người nhận
 * @param {string} options.subject - Tiêu đề email
 * @param {string} options.html - Nội dung email (HTML)
 * @throws {404} Không có email người nhận
 * @throws {Error} Gửi email thất bại
 */
export const sendEmail = async ({ email, subject, html }) => {
    // Validate email người nhận
    if (!email) {
        throw appError("Không tìm thấy email người nhận!", 404);
    }

    // Gửi email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html
    });
};