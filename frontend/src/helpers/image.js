const CLOUDINARY_REGEX = /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//;

export function getOptimizedImage(url, width = 400) {
    if (!url) return url;
    if (CLOUDINARY_REGEX.test(url)) {
        const transform = `w_${width},c_fill,q_auto,f_auto`;
        return url.replace('/upload/', `/upload/${transform}/`);
    }
    return url;
}
