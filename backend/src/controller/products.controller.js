import productModel from "../models/products.models.js";
import { appError } from "../common/appError.js";
import { createSlug } from "../utils/slug.js";
import { uploadImages } from "../services/uploadImages.js";
import {
    formatSuccessResponse,
    formatDate,
    sanitizeText
} from "../utils/format.js";

/* TẠO SẢN PHẨM MỚI */
export const createProduct = async (req, res) => {
    const { name, description, price, category, stock, images } = req.body;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    }

    // Kiểm tra nhập đầy đủ thông tin
    if (!name || !description || !price || !category || !stock) {
        throw appError("Missing fields!", 400);
    }

    // Kiểm tra tên sản phẩm không bị trùng
    const productExist = await productModel.findOne({ slug: createSlug(name) });
    if (productExist) {
        throw appError("Product already exists!", 400);
    }

    // Kiểm tra price và stock phải > 0
    if (price <= 0 || stock <= 0) {
        throw appError("Price and stock must be greater than 0", 400);
    }

    // Tạo sản phẩm mới
    const newProduct = await productModel.create({
        name: sanitizeText(name),
        slug: createSlug(name),
        description: sanitizeText(description),
        price: parseFloat(price),
        category,
        stock: parseInt(stock),
        images: images || []
    });

    await newProduct.populate('category', 'name slug');

    return res.status(201).json(formatSuccessResponse(
        'Product created successfully!',
        newProduct
    ));
};

/* LẤY TẤT CẢ SẢN PHẨM */
export const getAllProducts = async (req, res) => {
    const { page = 1, limit = 10, search, category, sortBy = 'createdAt', sortOrder = -1 } = req.query;

    // Tạo filter object
    const filter = {};

    // Filter theo search (tìm kiếm theo tên)
    if (search) {
        filter.name = { $regex: search, $options: 'i' }; // i: case-insensitive
    }

    // Filter theo danh mục
    if (category) {
        filter.category = category;
    }

    // Tính toán pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Lấy dữ liệu sản phẩm
    const products = await productModel
        .find(filter)
        .populate('category', 'name slug') // Lấy thông tin danh mục
        .sort({ [sortBy]: parseInt(sortOrder) })
        .skip(skip)
        .limit(parseInt(limit));

    // Tính tổng số sản phẩm cho pagination
    const total = await productModel.countDocuments(filter);

    if (!products || products.length === 0) {
        throw appError("No products found!", 404);
    }

    return res.json(formatSuccessResponse(
        'Products retrieved successfully!',
        products,
        {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    ));
};

/* LẤY SẢN PHẨM THEO ID */
export const getProductById = async (req, res) => {
    const { id } = req.params;

    const product = await productModel
        .findById(id)
        .populate('category', 'name slug');

    if (!product) {
        throw appError("Product not found!", 404);
    }

    return res.json(formatSuccessResponse(
        'Product retrieved successfully!',
        product
    ));
};

/* LẤY SẢN PHẨM THEO SLUG (dành cho frontend) */
export const getProductBySlug = async (req, res) => {
    const { slug } = req.params;

    const product = await productModel
        .findOne({ slug })
        .populate('category', 'name slug');

    if (!product) {
        throw appError("Product not found!", 404);
    }

    return res.json(formatSuccessResponse(
        'Product retrieved successfully!',
        product
    ));
};

/* CẬP NHẬT SẢN PHẨM */
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock, images } = req.body;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    }

    // Tìm sản phẩm
    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Product not found!", 404);
    }

    // Nếu thay đổi tên, kiểm tra slug không bị trùng
    if (name && name !== product.name) {
        const existingProduct = await productModel.findOne({
            slug: createSlug(name),
            _id: { $ne: id }
        });
        if (existingProduct) {
            throw appError("Product name already exists!", 400);
        }
        product.name = name;
        product.slug = createSlug(name);
    }

    // Kiểm tra price và stock phải > 0 (nếu được cập nhật)
    if (price !== undefined && price <= 0) {
        throw appError("Price must be greater than 0", 400);
    }
    if (stock !== undefined && stock <= 0) {
        throw appError("Stock must be greater than 0", 400);
    }

    // Cập nhật các trường thông tin
    if (description) product.description = sanitizeText(description);
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock) product.stock = parseInt(stock);
    if (images) product.images = images;

    await product.save();

    // Populate category info trước khi return
    await product.populate('category', 'name slug');

    return res.json(formatSuccessResponse(
        'Product updated successfully!',
        product
    ));
};

/* XÓA SẢN PHẨM */
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    }

    // Tìm và xóa sản phẩm
    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Product not found!", 404);
    }

    await product.deleteOne();

    return res.json(formatSuccessResponse(
        'Product deleted successfully!'
    ));
};

/* TÌM KIẾM SẢN PHẨM (với filter nâng cao) */
export const searchProducts = async (req, res) => {
    const { keyword, minPrice, maxPrice, category, inStock } = req.query;

    const filter = {};

    // Tìm kiếm theo từ khóa
    if (keyword) {
        filter.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } }
        ];
    }

    // Filter theo khoảng giá
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Filter theo danh mục
    if (category) {
        filter.category = category;
    }

    // Filter sản phẩm còn hàng
    if (inStock === 'true') {
        filter.stock = { $gt: 0 };
    }

    const products = await productModel
        .find(filter)
        .populate('category', 'name slug')
        .sort({ createdAt: -1 });

    if (!products || products.length === 0) {
        throw appError("No products found!", 404);
    }

    return res.json(formatSuccessResponse(
        'Search completed successfully!',
        products
    ));
};

/* LẤY SẢN PHẨM HOT/BÁN CHẠY NHẤT */
export const getTopProducts = async (req, res) => {
    const { limit = 10 } = req.query;

    const products = await productModel
        .find({ stock: { $gt: 0 } })
        .populate('category', 'name slug')
        .sort({ sold: -1 })
        .limit(parseInt(limit));

    if (!products || products.length === 0) {
        throw appError("No products found!", 404);
    }

    return res.json(formatSuccessResponse(
        'Top products retrieved successfully!',
        products
    ));
};

/* UPLOAD HÌNH ẢNH SẢN PHẨM */
export const uploadProductImages = async (req, res) => {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    }

    // Kiểm tra có file được upload không
    if (!req.files || req.files.length === 0) {
        throw appError("No files uploaded!", 400);
    }

    // Upload ảnh lên Cloudinary
    const uploadedImages = await uploadImages(req.files, "guitar-shop/products");

    return res.status(201).json(formatSuccessResponse(
        'Images uploaded successfully!',
        { images: uploadedImages }
    ));
};

/* CẬP NHẬT HÌNH ẢNH SẢN PHẨM */
export const updateProductImages = async (req, res) => {
    const { id } = req.params;
    const { images } = req.body;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    }

    // Tìm sản phẩm
    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Product not found!", 404);
    }

    // Cập nhật ảnh
    if (!images || images.length === 0) {
        throw appError("No images provided!", 400);
    }

    product.images = images;
    await product.save();

    // Populate category info
    await product.populate('category', 'name slug');

    return res.json(formatSuccessResponse(
        'Product images updated successfully!',
        product
    ));
};

/* THÊM HÌNH ẢNH VÀO SẢN PHẨM (thêm vào danh sách hiện tại) */
export const addProductImages = async (req, res) => {
    const { id } = req.params;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Admin only", 403);
    }

    // Kiểm tra có file được upload không
    if (!req.files || req.files.length === 0) {
        throw appError("No files uploaded!", 400);
    }

    // Tìm sản phẩm
    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Product not found!", 404);
    }

    // Upload ảnh lên Cloudinary
    const uploadedImages = await uploadImages(req.files, "guitar-shop/products");

    // Thêm ảnh mới vào danh sách ảnh hiện tại
    product.images = [...product.images, ...uploadedImages];
    await product.save();

    // Populate category info
    await product.populate('category', 'name slug');

    return res.json(formatSuccessResponse(
        'Images added to product successfully!',
        product
    ));
};