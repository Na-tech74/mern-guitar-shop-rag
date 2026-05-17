import mongoose from "mongoose";

/**
 * Schema cho danh mục sản phẩm
 * Dùng để phân loại sản phẩm (ví dụ: Guitar điện, Guitar acoustic, Amplifier)
 */
const categorySchema = new mongoose.Schema(
  {
    /**
     * Tên danh mục - định danh duy nhất
     * Ví dụ: "Guitar điện", "Guitar acoustic"
     */
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /**
     * Mô tả danh mục để hiển thị
     */
    description: {
      type: String,
      default: "",
    },

    /**
     * Đường dẫn hoặc URL hình ảnh danh mục
     * Dùng để hiển thị danh mục ở frontend
     */
    image: {
      type: String,
      default: "",
    },

    /**
     * Cờ kiểm soát hiển thị danh mục
     * Danh mục không hoạt động sẽ bị ẩn khỏi người dùng nhưng vẫn được lưu trong database
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);