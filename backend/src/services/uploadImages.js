import cloudinary from "../config/cloudinay.config.js";
import fs from "fs";

export const uploadImages = async (files, folder = "default") => {
  return Promise.all(
    files.map(async (file) => {
      try {
        const res = await cloudinary.uploader.upload(file.path, {
          folder,
          resource_type: "image"
        });

        // xoá file local an toàn
        fs.unlink(file.path, (err) => {
          if (err) {
            console.error("Delete file error:", err);
          }
        });

        return res.secure_url;
      } catch (err) {
        // nếu upload fail vẫn xoá file
        fs.unlink(file.path, () => { });
        throw err;
      }
    })
  );
};