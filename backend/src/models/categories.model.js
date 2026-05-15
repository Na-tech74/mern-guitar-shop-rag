import mongoose from "mongoose";

// Tạo schema cho Category (loại sản phẩm)
const categorySchema = new mongoose.Schema(
  {
    // Tên category (ví dụ: Guitar Acoustic)
    name: {
      type: String,
      required: true, // bắt buộc phải có
      unique: true,   // không được trùng tên
      trim: true,     // xóa khoảng trắng đầu/cuối
    },

    // URL thân thiện (ví dụ: guitar-acoustic)
    slug: {
      type: String,
      unique: true,    // mỗi category có 1 slug riêng
      lowercase: true, // luôn viết thường
    },

    // Mô tả category (không bắt buộc)
    description: {
      type: String,
      default: "", // nếu không nhập thì để rỗng
    },

    // Hình ảnh category
    image: {
      type: String,
      default: "",
    },

    // trạng thái hiển thị (true = đang dùng)
    isActive: {
      type: Boolean,
      default: true, // mặc định là đang hoạt động
    },
  },
  {
    timestamps: true, // tự động tạo createdAt và updatedAt
  }
);

// Export model để dùng ở nơi khác (controller, service)
export default mongoose.model("category", categorySchema);