// middleware/upload.middleware.js
import multer from "multer";

const storage = multer.diskStorage({});

const fileFilter = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) { 
        callback(null, true); 
    }
    else callback(new Error("Only image files allowed"), false);
};

export const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter,
});
