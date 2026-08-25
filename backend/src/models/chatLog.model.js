import mongoose from "mongoose";

const chatLogSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
            trim: true,
        },
        reply: {
            type: String,
            default: "",
        },
        sources: {
            type: [String],
            default: [],
        },
        topic: {
            type: String,
            default: "khác",
            trim: true,
        },
        sessionId: {
            type: String,
            default: "anonymous",
        },
    },
    { timestamps: true }
);

chatLogSchema.index({ createdAt: -1 });
chatLogSchema.index({ topic: 1 });

const ChatLog = mongoose.model("ChatLog", chatLogSchema);

export default ChatLog;
