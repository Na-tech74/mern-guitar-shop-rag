/**
 * uploadVideos.js
 * Service upload file video lên Cloudinary.
 * Tự động xóa file tạm trên disk sau khi upload thành công hoặc thất bại.
 */

import cloudinary from "../config/cloudinay.config.js";
import fs from "fs";

/**
 * Upload danh sách file video lên Cloudinary
 * @param {File[]} files - Mảng file từ Multer
 * @param {string} folder - Thư mục trên Cloudinary (mặc định: "default")
 * @returns {Promise<string[]>} Mảng URL video đã upload
 */
export const uploadVideos = async (files, folder = "default") => {
  return Promise.all(
    files.map(async (file) => {
      try {
        const res = await cloudinary.uploader.upload(file.path, {
          folder: folder,
          resource_type: "video"
        });

        if (file.path) {
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error("Xóa file video tạm thất bại", err);
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
