import cloudinary from "../config/cloudinay.config.js";
import fs from "fs";

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
              console.error("Delete file error:", err);
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