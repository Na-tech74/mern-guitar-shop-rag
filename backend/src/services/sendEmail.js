import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import { appError } from "../utils/appError.js";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
export const sendEmail = async ({ email, subject, html }) => {
    if (!email) {
        throw appError("Không tìm thấy email người nhận !", 404)
    };
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html
    });
};