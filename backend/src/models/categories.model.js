/**
 * categories.model.js
 * Schema cho danh mục sản phẩm
 * Dùng để phân loại sản phẩm (ví dụ: Guitar điện, Guitar acoustic, Amplifier)
 */

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
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
