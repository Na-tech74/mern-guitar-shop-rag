import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
    },

    accessToken: String,
    refreshToken: String,

    resetOtp: { type: String, default: "" },
    resetOtpExpire: { type: Number, default: 0 },
    
    role: {
        type: String,
        default: "user"
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);