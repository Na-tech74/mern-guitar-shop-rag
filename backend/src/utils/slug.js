import slugify from "slugify";
// Tạo slug từ tên sản phẩm hoặc danh mục
// vi dụ: "Guitar Fender Stratocaster" -> "guitar-fender-stratocaster"
export const createSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
  });
};