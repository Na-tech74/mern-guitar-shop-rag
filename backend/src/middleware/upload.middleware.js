/**
 * upload.middleware.js
 * Cấu hình Multer cho upload file ảnh và video.
 * - Lưu file tạm thời trên disk (diskStorage)
 * - Chỉ chấp nhận file ảnh hoặc video (theo mimetype)
 * - Giới hạn kích thước: 10MB cho ảnh, 50MB cho video
 */

import multer from "multer";

const storage = multer.diskStorage({});

const imageFileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    }
    else callback(new Error("Chỉ cho phép tải lên file hình ảnh !"), false);
};

const videoFileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("video")) {
        callback(null, true);
    }
    else callback(new Error("Chỉ cho phép tải lên file video !"), false);
};

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: imageFileFilter,
});

export const uploadVideo = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: videoFileFilter,
});
