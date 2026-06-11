import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema({
    icon: {
        type: String,
        enum: ["map", "phone", "email", "clock"],
        default: "map"
    },
    label: { type: String, default: "" },
    value: { type: String, default: "" },
}, { _id: false });

const contactContentSchema = new mongoose.Schema({
    header: {
        title: { type: String, default: "Liên hệ với chúng tôi" },
        subtitle: { type: String, default: "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn" },
    },
    contactInfo: {
        type: [contactInfoSchema],
        default: [
            { icon: "map", label: "Địa chỉ", value: "537/1 An Phú Đông, Q12, TP. Hồ Chí Minh" },
            { icon: "phone", label: "Điện thoại", value: "037.862.3181" },
            { icon: "email", label: "Email", value: "namn98561@gmail.com" },
            { icon: "clock", label: "Giờ làm việc", value: "T2 - CN: 8:00 - 22:00" },
        ]
    },
    socialLinks: {
        facebook: { type: String, default: "" },
        instagram: { type: String, default: "" },
        youtube: { type: String, default: "" },
    },
    mapEmbedUrl: {
        type: String,
        default: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13390.654967441898!2d106.68795299527685!3d10.823414364813097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1779364882168!5m2!1svi!2s"
    },
}, {
    timestamps: true
});

export default mongoose.model("ContactContent", contactContentSchema);
