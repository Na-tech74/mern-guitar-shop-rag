import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    // URL thân thiện (ví dụ: guitar-acoustic)
    slug: {
        type: String,
        required: true,
        unique: true
    },
    // Mô tả sản phẩm (bắt buộc)
    description: {
        type: String,
        required: true,
        trim: true
    },
    // Giá sản phẩm (bắt buộc, không âm)
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    // Tham chiếu đến category (loại sản phẩm)
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    // Số lượng tồn kho của sản phẩm
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    // Số lượng đã bán của sản phẩm (để tính sản phẩm bán chạy)
    sold: {
        type: Number,
        default: 0,
        min: 0
    },
    images: [String],
}, {
    timestamps: true
});
export default mongoose.model("product", productSchema);