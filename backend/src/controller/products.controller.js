import productModel from "../models/products.models.js";
import { appError } from "../common/appError.js";
import { createSlug } from "../utils/slug.js";
import { uploadImages } from "../services/uploadImages.js";
import {
    formatSuccessResponse,
    formatDate,
    sanitizeText
} from "../utils/format.js";

/**
 * Validate MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @returns {boolean} - True if valid ObjectId
 */
const isValidObjectId = (id) => id.match(/^[0-9a-fA-F]{24}$/);

/**
 * @desc Tạo sản phẩm mới
 * @route POST /api/products
 * @access Private (chỉ admin)
 */
export const createProduct = async (req, res) => {
    const { name, description, price, category, stock, images } = req.body;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Kiểm tra nhập đầy đủ thông tin
    if (!name || !description || !price || !category || !stock) {
        throw appError("Nhập đầy đủ thông tin sản phẩm!", 400);
    }

    // Kiểm tra tên sản phẩm không bị trùng (theo slug)
    const productExist = await productModel.findOne({ slug: createSlug(name) });
    if (productExist) {
        throw appError("Sản phẩm đã tồn tại!", 400);
    }

    // Kiểm tra price và stock phải > 0
    if (price <= 0 || stock <= 0) {
        throw appError("Giá và số lượng tồn kho phải lớn hơn 0", 400);
    }

    // Tạo sản phẩm mới (sanitize text để tránh XSS)
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
        'Sản phẩm đã được tạo thành công!',
        newProduct
    ));
};

/**
 * @desc Lấy tất cả sản phẩm (có phân trang, tìm kiếm, lọc)
 * @route GET /api/products
 * @access Public
 */
export const getAllProducts = async (req, res) => {
    const { page = 1,
        limit = 10,
        search, category,
        sortBy = 'createdAt',
        sortOrder = -1
    } = req.query;

    // Tạo filter object
    const filter = {};

    // Filter theo search (tìm kiếm theo tên, case-insensitive)
    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }

    // Filter theo danh mục
    if (category) {
        filter.category = category;
    }

    // Tính toán pagination (skip/limit)
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Lấy dữ liệu sản phẩm với populate category
    const products = await productModel
        .find(filter)
        .populate('category', 'name slug')
        .sort({ [sortBy]: parseInt(sortOrder) })
        .skip(skip)
        .limit(parseInt(limit));

    // Tính tổng số sản phẩm cho pagination
    const total = await productModel.countDocuments(filter);

    if (!products || products.length === 0) {
        throw appError("Không tìm thấy sản phẩm nào!", 404);
    }

    return res.json(formatSuccessResponse(
        'Sản phẩm đã được lấy thành công!',
        products,
        {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    ));
};

/**
 * @desc Lấy sản phẩm theo ID
 * @route GET /api/products/:id
 * @access Public
 */
export const getProductById = async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    const product = await productModel
        .findById(id)
        .populate('category', 'name slug');

    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    return res.json(formatSuccessResponse(
        'Sản phẩm đã được lấy thành công!',
        product
    ));
};

/**
 * @desc Lấy sản phẩm theo Slug (dành cho frontend)
 * @route GET /api/products/slug/:slug
 * @access Public
 */
export const getProductBySlug = async (req, res) => {
    const { slug } = req.params;

    const product = await productModel
        .findOne({ slug })
        .populate('category', 'name slug');

    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    return res.json(formatSuccessResponse(
        'Sản phẩm đã được lấy thành công!',
        product
    ));
};

/**
 * @desc Cập nhật sản phẩm
 * @route PUT /api/products/:id
 * @access Private (chỉ admin)
 */
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock, images } = req.body;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    // Tìm sản phẩm
    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    // Nếu thay đổi tên, kiểm tra slug không bị trùng (trừ sản phẩm hiện tại)
    if (name && name !== product.name) {
        const existingProduct = await productModel.findOne({
            slug: createSlug(name),
            _id: { $ne: id }
        });
        if (existingProduct) {
            throw appError("Tên sản phẩm đã tồn tại!", 400);
        }
        product.name = sanitizeText(name);
        product.slug = createSlug(name);
    }

    // Kiểm tra price và stock phải > 0 (nếu được cập nhật)
    if (price !== undefined && price <= 0) {
        throw appError("Giá phải lớn hơn 0", 400);
    }
    if (stock !== undefined && stock <= 0) {
        throw appError("Số lượng tồn kho phải lớn hơn 0", 400);
    }

    // Cập nhật các trường thông tin (sanitize description)
    if (description) product.description = sanitizeText(description);
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock) product.stock = parseInt(stock);
    if (images) product.images = images;

    await product.save();

    // Populate category info trước khi return
    await product.populate('category', 'name slug');

    return res.json(formatSuccessResponse(
        'Sản phẩm đã được cập nhật thành công!',
        product
    ));
};

/**
 * @desc Xóa sản phẩm
 * @route DELETE /api/products/:id
 * @access Private (chỉ admin)
 */
export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    // Tìm sản phẩm
    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    await product.deleteOne();

    return res.json(formatSuccessResponse(
        'Sản phẩm đã được xóa thành công!'
    ));
};

/**
 * @desc Tìm kiếm sản phẩm với filter nâng cao
 * @route GET /api/products/search
 * @access Public
 */
export const searchProducts = async (req, res) => {
    const { keyword, minPrice, maxPrice, category, inStock } = req.query;

    const filter = {};

    // Tìm kiếm theo từ khóa (tên hoặc mô tả)
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
        throw appError("Không tìm thấy sản phẩm nào!", 404);
    }

    return res.json(formatSuccessResponse(
        'Tìm kiếm thành công!',
        products
    ));
};

/**
 * @desc Lấy sản phẩm bán chạy nhất (hot)
 * @route GET /api/products/top
 * @access Public
 */
export const getTopProducts = async (req, res) => {
    const { limit = 10 } = req.query;

    const products = await productModel
        .find({ stock: { $gt: 0 } })
        .populate('category', 'name slug')
        .sort({ sold: -1 })
        .limit(parseInt(limit));

    if (!products || products.length === 0) {
        throw appError("Không tìm thấy sản phẩm nào!", 404);
    }

    return res.json(formatSuccessResponse(
        'Sản phẩm bán chạy nhất đã được lấy thành công!',
        products
    ));
};

/**
 * @desc Upload hình ảnh sản phẩm lên Cloudinary
 * @route POST /api/products/upload
 * @access Private (chỉ admin)
 */
export const uploadProductImages = async (req, res) => {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Kiểm tra có file được upload không
    if (!req.files || req.files.length === 0) {
        throw appError("Không có tệp nào được tải lên!", 400);
    }

    // Upload ảnh lên Cloudinary
    const uploadedImages = await uploadImages(req.files, "guitar-shop/products");

    return res.status(201).json(formatSuccessResponse(
        'Hình ảnh đã được tải lên thành công!',
        { images: uploadedImages }
    ));
};

/**
 * @desc Cập nhật hình ảnh sản phẩm (thay thế)
 * @route PUT /api/products/:id/images
 * @access Private (chỉ admin)
 */
export const updateProductImages = async (req, res) => {
    const { id } = req.params;
    const { images } = req.body;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    // Tìm sản phẩm
    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    // Cập nhật ảnh (phải có ít nhất 1 ảnh)
    if (!images || images.length === 0) {
        throw appError("Không có hình ảnh nào được cung cấp!", 400);
    }

    product.images = images;
    await product.save();

    // Populate category info
    await product.populate('category', 'name slug');

    return res.json(formatSuccessResponse(
        'Sản phẩm đã được cập nhật hình ảnh thành công!',
        product
    ));
};

/**
 * @desc Thêm hình ảnh vào sản phẩm (thêm vào danh sách hiện tại)
 * @route POST /api/products/:id/images
 * @access Private (chỉ admin)
 */
export const addProductImages = async (req, res) => {
    const { id } = req.params;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    // Kiểm tra có file được upload không
    if (!req.files || req.files.length === 0) {
        throw appError("Không có tệp nào được tải lên!", 400);
    }

    // Tìm sản phẩm
    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    // Upload ảnh lên Cloudinary
    const uploadedImages = await uploadImages(req.files, "guitar-shop/products");

    // Thêm ảnh mới vào danh sách ảnh hiện tại
    product.images = [...product.images, ...uploadedImages];
    await product.save();

    // Populate category info
    await product.populate('category', 'name slug');

    return res.json(formatSuccessResponse(
        'Hình ảnh đã được thêm vào sản phẩm thành công!',
        product
    ));
};

/**
 * @desc Lấy sản phẩm theo danh mục
 * @route GET /api/products/category/:categoryId
 * @access Public
 */
export const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate ObjectId format
    if (!isValidObjectId(categoryId)) {
        throw appError("ID danh mục không hợp lệ!", 400);
    }

    // Tính toán pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Lấy sản phẩm theo danh mục
    const products = await productModel
        .find({ category: categoryId })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    // Tính tổng số sản phẩm
    const total = await productModel.countDocuments({ category: categoryId });

    if (!products || products.length === 0) {
        throw appError("Không tìm thấy sản phẩm nào!", 404);
    }

    return res.json(formatSuccessResponse(
        'Sản phẩm đã được lấy thành công!',
        products,
        {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    ));
};

/**
 * @desc Cập nhật số lượng tồn kho (dùng cho xử lý đơn hàng)
 * @route PUT /api/products/:id/stock
 * @access Private (chỉ admin)
 */
export const updateStock = async (req, res) => {
    const { id } = req.params;
    const { quantity, action } = req.body; // action: 'increase' hoặc 'decrease'

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    // Validate input
    if (!quantity || quantity <= 0) {
        throw appError("Số lượng phải lớn hơn 0!", 400);
    }

    if (!action || !['increase', 'decrease'].includes(action)) {
        throw appError("Hành động không hợp lệ! (increase hoặc decrease)", 400);
    }

    // Tìm sản phẩm
    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    // Cập nhật số lượng tồn kho
    if (action === 'increase') {
        product.stock += parseInt(quantity);
    } else {
        if (product.stock < quantity) {
            throw appError("Số lượng tồn kho không đủ!", 400);
        }
        product.stock -= parseInt(quantity);
    }

    await product.save();

    return res.json(formatSuccessResponse(
        'Cập nhật tồn kho thành công!',
        {
            productId: product._id,
            stock: product.stock
        }
    ));
};

/**
 * @desc Lấy sản phẩm mới nhất
 * @route GET /api/products/latest
 * @access Public
 */
export const getLatestProducts = async (req, res) => {
    const { limit = 10 } = req.query;

    const products = await productModel
        .find({ stock: { $gt: 0 } })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

    if (!products || products.length === 0) {
        throw appError("Không tìm thấy sản phẩm nào!", 404);
    }

    return res.json(formatSuccessResponse(
        'Sản phẩm mới nhất đã được lấy thành công!',
        products
    ));
};