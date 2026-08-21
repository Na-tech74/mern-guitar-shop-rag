import Brand from "../models/brands.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { formatDateTime, sanitizeText, Slug } from "../utils/format.js";
import { uploadImages } from "../services/uploadImages.js";
import { isValidObjectId } from "../utils/valid.js";


export const createBrand = async (req, res) => {
    const { name, description, country, website, isActive } = req.body;
    const logoFile = req.file;
    if (!name) {
        throw appError("Thiếu tên thương hiệu!", 400);
    }
    const sanitizedName = sanitizeText(name)
    const slug = Slug(sanitizedName);
    const existing = await Brand.findOne({ slug });
    if (existing) {
        throw appError("Thương hiệu này đã tồn tại!", 400);
    }
    let logoUrl = "";
    if (logoFile) {
        [logoUrl] = await uploadImages([logoFile], "guitar-shop/brands");
    }

    const brand = await Brand.create({
        name: sanitizedName,
        slug,
        logo: logoUrl,
        description: description || "",
        country: country || "",
        website: website || "",
        isActive: isActive !== undefined ? isActive : true,
    });

    return appSuccess(res, {
        statusCode: 201,
        message: "Tạo thương hiệu thành công!",
        data: { brand },
    });
};
export const getAllBrands = async (req, res) => {
    const { isActive } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const brands = await Brand.find(filter).sort({ createdAt: -1 });
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh sách thương hiệu thành công!",
        data: { brands },
    });
};

export const getBrandById = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw appError("ID không hợp lệ!", 400);
    const brand = await Brand.findById(id);
    if (!brand) throw appError("Thương hiệu không tồn tại!", 404);
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy thông tin thương hiệu thành công!",
        data: { brand },
    });
};

export const updateBrand = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw appError("ID không hợp lệ!", 400);
    const brand = await Brand.findById(id);
    if (!brand) throw appError("Thương hiệu không tồn tại!", 404);

    const { name, description, country, website, isActive } = req.body;

    if (name) {
        const newSlug = Slug(name);
        const existing = await Brand.findOne({ slug: newSlug, _id: { $ne: id } });
        if (existing) throw appError("Tên thương hiệu đã tồn tại!", 400);
        brand.name = sanitizeText(name);
        brand.slug = newSlug;
    }
    if (description !== undefined) brand.description = description;
    if (country !== undefined) brand.country = country;
    if (website !== undefined) brand.website = website;
    if (isActive !== undefined) brand.isActive = isActive;
    if (req.file) {
        const [logoUrl] = await uploadImages([req.file], "guitar-shop/brands");
        brand.logo = logoUrl;
    }

    await brand.save();
    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật thương hiệu thành công!",
        data: { brand },
    });
};

export const deleteBrand = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw appError("ID không hợp lệ!", 400);
    const brand = await Brand.findById(id);
    if (!brand) throw appError("Thương hiệu không tồn tại!", 404);
    await brand.deleteOne();
    return appSuccess(res, {
        statusCode: 200,
        message: "Xóa thương hiệu thành công!",
    });
};