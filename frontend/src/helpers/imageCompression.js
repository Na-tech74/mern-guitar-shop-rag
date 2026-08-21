import imageCompression from "browser-image-compression";

const DEFAULT_OPTIONS = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
};

export const compressImage = (file, options = {}) =>
    imageCompression(file, { ...DEFAULT_OPTIONS, ...options });
