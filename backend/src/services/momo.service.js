import crypto from "crypto";
import https from "https";

const PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
const ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
const SECRET_KEY = process.env.MOMO_SECRET_KEY;
const MOMO_API_URL = process.env.MOMO_API_URL;
const MOMO_API_PATH = process.env.MOMO_API_PATH;

export const createMomoPayment = async ({ amount, orderId, orderInfo, redirectUrl, ipnUrl }) => {
    const requestId = orderId;
    const requestType = "payWithMethod";
    const extraData = "";
    const autoCapture = true;
    const lang = "vi";

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

export const verifyMomoCallback = ({ partnerCode, orderId, requestId, amount, orderInfo, orderType, transId, resultCode, message, payType, responseTime, extraData, signature }) => {
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
