/**
 * upload.middleware.js
 * Cấu hình Multer cho upload file ảnh.
 * - Lưu file tạm thời trên disk (diskStorage)
 * - Chỉ chấp nhận file ảnh (theo mimetype)
 * - Giới hạn kích thước 10MB
 */

import multer from "multer";

const storage = multer.diskStorage({});

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    }
    else callback(new Error("Chỉ cho phép tải lên file hình ảnh !"), false);
};

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
});
