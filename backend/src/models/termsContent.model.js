import mongoose from "mongoose";

const termsSectionSchema = new mongoose.Schema({
    title: { type: String, default: "" },
    content: { type: String, default: "" },
}, { _id: false });

const termsContentSchema = new mongoose.Schema({
    header: {
        title: { type: String, default: "Điều khoản và Bảo mật" },
        lastUpdated: { type: String, default: "" },
    },
    sections: [termsSectionSchema],
}, { timestamps: true });

export default mongoose.model("TermsContent", termsContentSchema);
