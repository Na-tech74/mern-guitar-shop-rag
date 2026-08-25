import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import fs from "fs";
import path from "path";
import ChatLog from "../models/chatLog.model.js";

const router = express.Router();

const BOT_URL = process.env.BOT_URL || "http://localhost:8000";
const DATA_DIR = path.resolve(process.cwd(), "bot", "data");

async function proxyToBot(path, body) {
    const res = await fetch(`${BOT_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    return res.json();
}

function detectTopic(message) {
    const msg = message.toLowerCase();
    if (/giá|bao nhiêu|đắt|cheap|expensive|cost|giá cả|tiền/.test(msg)) return "giá cả";
    if (/guitar|đàn|ghita|âm thanh|sound|pickups|phím|dây|neck|body/.test(msg)) return "guitar";
    if (/giao hàng|ship|vận chuyển|deliver|nhận hàng|ship COD|phí ship/.test(msg)) return "giao hàng";
    if (/bảo hành|warranty|sửa chữa|repair|lỗi|defect/.test(msg)) return "bảo hành";
    if (/đổi trả|return|hoàn tiền|refund|trả hàng/.test(msg)) return "đổi trả";
    if (/thanh toán|payment|momo|chuyển khoản|COD|trả góp|installment/.test(msg)) return "thanh toán";
    if (/hướng dẫn|tutorial|cách|how to|chơi|practice|tư thế/.test(msg)) return "hướng dẫn";
    if (/so sánh|compare|loại|brand|thương hiệu|đối với/.test(msg)) return "so sánh sản phẩm";
    if (/phụ kiện|accessories|amp|pedal|tuner|capo|pick/.test(msg)) return "phụ kiện";
    return "khác";
}

router.post("/chat", asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: "Thiếu nội dung tin nhắn!" });
    }
    const result = await proxyToBot("/api/chat", { message });

    ChatLog.create({
        message: message.trim(),
        reply: result.reply || "",
        sources: result.sources || [],
        topic: detectTopic(message),
        sessionId: req.headers["x-session-id"] || "anonymous",
    }).catch(() => {});

    return res.json({ success: true, data: result });
}));

router.get("/stats", protect, adminOnly, asyncHandler(async (req, res) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now);
    thisWeek.setDate(now.getDate() - 7);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, todayCount, weekCount, monthCount, topicStats] = await Promise.all([
        ChatLog.countDocuments(),
        ChatLog.countDocuments({ createdAt: { $gte: today } }),
        ChatLog.countDocuments({ createdAt: { $gte: thisWeek } }),
        ChatLog.countDocuments({ createdAt: { $gte: thisMonth } }),
        ChatLog.aggregate([
            { $match: { createdAt: { $gte: thisMonth } } },
            { $group: { _id: "$topic", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]),
    ]);

    const dailyByHour = await ChatLog.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);

    return res.json({
        success: true,
        data: {
            total,
            todayCount,
            weekCount,
            monthCount,
            topicStats: topicStats.map(t => ({ topic: t._id, count: t.count })),
            hourlyToday: dailyByHour.map(h => ({ hour: h._id, count: h.count })),
        },
    });
}));

router.get("/recent", protect, adminOnly, asyncHandler(async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const logs = await ChatLog.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("message reply topic createdAt")
        .lean();

    return res.json({ success: true, data: logs });
}));

router.post("/reindex", protect, adminOnly, asyncHandler(async (req, res) => {
    const result = await proxyToBot("/api/reindex", {});
    return res.json({ success: true, data: result });
}));

router.get("/policy-files", protect, adminOnly, asyncHandler(async (req, res) => {
    if (!fs.existsSync(DATA_DIR)) {
        return res.json({ success: true, data: { files: [] } });
    }

    const files = fs.readdirSync(DATA_DIR)
        .filter(f => f.endsWith(".txt"))
        .map(f => {
            const content = fs.readFileSync(path.join(DATA_DIR, f), "utf-8");
            const lines = content.split("\n").filter(l => l.trim());
            const title = lines[0] || f.replace(".txt", "");
            return {
                filename: f,
                title: title,
                size: content.length,
                lines: lines.length,
            };
        });

    return res.json({ success: true, data: { files } });
}));

router.get("/policy-files/:filename", protect, adminOnly, asyncHandler(async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(DATA_DIR, filename);

    if (!filename.endsWith(".txt") || !fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "File không tồn tại!" });
    }

    const content = fs.readFileSync(filePath, "utf-8");
    return res.json({ success: true, data: { filename, content } });
}));

export default router;
