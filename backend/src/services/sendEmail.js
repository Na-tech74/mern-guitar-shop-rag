/* use lib npm install nodemailer */
/*https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4M
--IORJYU08D7djQAHtY47VL2KSBXzj-55uP4KXpLu-gMazFc35coapy4PZ2YNO4IK1KVer579nxM6vIVIYJCGf7EMn5HmgcVyUtriDwxcPP1d9pc */

import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS   // app password, KHÔNG phải mật khẩu gmail
    }
});
export const sendEmail = async ({ email, subject, html }) => {
    // console.log("USER:", process.env.EMAIL_USER);
    // console.log("PASS:", process.env.EMAIL_PASS);
    if (!email) {
        throw new Error(" không có email người nhận !");
    };
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html
    });
};