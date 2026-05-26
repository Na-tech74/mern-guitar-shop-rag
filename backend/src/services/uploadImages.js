/**
 * uploadImages.js
 * Service upload file ảnh lên Cloudinary.
 * Tự động xóa file tạm trên disk sau khi upload thành công hoặc thất bại.
 */

import cloudinary from "../config/cloudinay.config.js";
import fs from "fs";

/**
 * Upload danh sách file lên Cloudinary
 * @param {File[]} files - Mảng file từ Multer
 * @param {string} folder - Thư mục trên Cloudinary (mặc định: "default")
 * @returns {Promise<string[]>} Mảng URL ảnh đã upload
 */
export const uploadImages = async (files, folder = "default") => {
  return Promise.all(
    files.map(async (file) => {
      try {
        const res = await cloudinary.uploader.upload(file.path, {
          folder: folder,
          resource_type: "image"
        });

        if (file.path) {
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error("Xóa file ảnh thất bại", err);
            }
          });
        }

        return res.secure_url;
      } catch (err) {
        if (file.path) {
          fs.unlink(file.path, () => { });
        }
        throw err;
      }
    })
  );
};