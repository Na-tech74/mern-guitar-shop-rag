import cloudinary from "../config/cloudinay.config.js";
import fs from "fs";

export const uploadImages = async (files, folder = "default") => {
  return Promise.all(
    files.map(async (file) => {
      try {
        const res = await cloudinary.uploader.upload(file.path, {
          folder,
          transformation: [
            { width: 800, height: 800, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        });

        // xoá file local an toàn
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("Delete file error:", err);
          }
        });

        return {
          url: res.secure_url,
          public_id: res.public_id,
        };
      } catch (err) {
        // nếu upload fail vẫn xoá file
        fs.unlink(file.path, () => { });
        throw err;
      }
    })
  );
};