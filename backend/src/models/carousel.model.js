import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    cta: { type: String, default: "Xem thêm" },
    path: { type: String, default: "/products" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Carousel", carouselSchema);