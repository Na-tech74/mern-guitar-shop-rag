/**
 * momo.service.js
 * Service tích hợp cổng thanh toán MoMo
 * Cung cấp chức năng tạo yêu cầu thanh toán và xác thực callback từ MoMo
 */

import crypto from "crypto";
import https from "https";

const PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
const ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
const SECRET_KEY = process.env.MOMO_SECRET_KEY;
const MOMO_API_URL = process.env.MOMO_API_URL;
const MOMO_API_PATH = process.env.MOMO_API_PATH;

/**
 * Tạo yêu cầu thanh toán MoMo
 * @param {Object} params - Tham số thanh toán
 * @param {number} params.amount - Số tiền thanh toán
 * @param {string} params.orderId - Mã đơn hàng
 * @param {string} params.orderInfo - Thông tin đơn hàng
 * @param {string} params.redirectUrl - URL chuyển hướng sau khi thanh toán thành công
 * @param {string} params.ipnUrl - URL nhận thông báo thanh toán từ MoMo
 * @returns {Promise<Object>} Phản hồi từ MoMo API
 * @throws {Error} Lỗi kết nối hoặc response không hợp lệ
 */
export const createMomoPayment = async ({ amount, orderId, orderInfo, redirectUrl, ipnUrl }) => {
    const requestId = orderId;
    const requestType = "payWithMethod";
    const extraData = "";
    const autoCapture = true;
    const lang = "vi";

    // Tạo chữ ký HMAC-SHA256 để xác thực request
    const rawSignature =
        `accessKey=${ACCESS_KEY}&amount=${amount}&extraData=${extraData}` +
        `&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}` +
        `&partnerCode=${PARTNER_CODE}&redirectUrl=${redirectUrl}` +
        `&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(rawSignature)
        .digest("hex");

    const requestBody = JSON.stringify({
        partnerCode: PARTNER_CODE,
        partnerName: "Guitar Shop",
        storeId: "GuitarShopStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        signature,
    });

    // Gửi request POST đến API MoMo
    return new Promise((resolve, reject) => {
        const options = {
            hostname: MOMO_API_URL,
            port: 443,
            path: MOMO_API_PATH,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
            },
        };

        const req = https.request(options, (res) => {
            let body = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => { body += chunk; });
            res.on("end", () => {
                try {
                    resolve(JSON.parse(body));
                } catch {
                    reject(new Error("Invalid MoMo response"));
                }
            });
        });

        req.on("error", reject);
        req.write(requestBody);
        req.end();
    });
};

/**
 * Xác thực chữ ký callback từ MoMo
 * @param {Object} params - Tham số callback từ MoMo
 * @param {string} params.partnerCode - Mã đối tác
 * @param {string} params.orderId - Mã đơn hàng
 * @param {string} params.requestId - Mã request
 * @param {number} params.amount - Số tiền
 * @param {string} params.orderInfo - Thông tin đơn hàng
 * @param {string} params.orderType - Loại đơn hàng
 * @param {string} params.transId - Mã giao dịch MoMo
 * @param {number} params.resultCode - Mã kết quả
 * @param {string} params.message - Thông báo
 * @param {string} params.payType - Loại thanh toán
 * @param {number} params.responseTime - Thời gian phản hồi
 * @param {string} params.extraData - Dữ liệu mở rộng
 * @param {string} params.signature - Chữ ký cần xác thực
 * @returns {boolean} true nếu chữ ký hợp lệ, false nếu không
 */
export const verifyMomoCallback = ({ partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature }) => {
    // Tạo chữ ký từ dữ liệu nhận được để so sánh với chữ ký MoMo gửi
    const rawSignature =
        `accessKey=${ACCESS_KEY}&amount=${amount}&extraData=${extraData}` +
        `&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}` +
        `&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}` +
        `&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}` +
        `&transId=${transId}`;

    const expected = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(rawSignature)
        .digest("hex");

    return expected === signature;
};
