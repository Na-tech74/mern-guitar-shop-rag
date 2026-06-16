/**
 * upload.middleware.js
 * Cấu hình Multer cho upload file ảnh và video.
 * - Lưu file tạm thời trên disk (diskStorage)
 * - Chỉ chấp nhận file ảnh hoặc video (theo mimetype)
 * - Giới hạn kích thước: 10MB cho ảnh, 50MB cho video
 */

import multer from "multer";

const storage = multer.diskStorage({});

/**
 * Bộ lọc file chỉ chấp nhận định dạng ảnh
 * @param {Object} req - Request object
 * @param {Object} file - File object từ multer
 * @param {Function} callback - Callback (error, allowed)
 */
const imageFileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    }
    else callback(new Error("Chỉ cho phép tải lên file hình ảnh !"), false);
};

/**
 * Bộ lọc file chỉ chấp nhận định dạng video
 * @param {Object} req - Request object
 * @param {Object} file - File object từ multer
 * @param {Function} callback - Callback (error, allowed)
 */
const videoFileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("video")) {
        callback(null, true);
    }
    else callback(new Error("Chỉ cho phép tải lên file video !"), false);
};

/** Multer instance cho upload ảnh (tối đa 10MB) */
export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: imageFileFilter,
});

/** Multer instance cho upload video (tối đa 50MB) */
export const uploadVideo = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: videoFileFilter,
});
