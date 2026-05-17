import productModel from "../models/products.models.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { uploadImages } from "../services/uploadImages.js";
import { formatSuccessResponse, formatDate, formatDateTime, sanitizeText, formatPrice } from "../utils/format.js";
import { isValidObjectId } from "../utils/vaildate.js";

/**
 * Tạo sản phẩm mới (Admin only)
 * @param {string} name - Tên sản phẩm (bắt buộc)
 * @param {string} description - Mô tả sản phẩm (bắt buộc)
 * @param {number} price - Giá sản phẩm (bắt buộc, > 0)
 * @param {string} category - ID danh mục (bắt buộc)
 * @param {number} stock - Số lượng tồn kho (bắt buộc, > 0)
 * @param {File[]} images - Hình ảnh sản phẩm (bắt buộc, tối đa 5)
 * @requires req.user.role = 'admin'
 * @throws {400} Thiếu thông tin | Sản phẩm đã tồn tại
 * @throws {403} Không có quyền
 * @returns {201} Sản phẩm vừa tạo
 */
export const createProduct = async (req, res) => {
    // Lấy dữ liệu từ form-data
    const { name, description, price, category, stock } = req.body;
    const imageFiles = req.files;

    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    // Validate thông tin bắt buộc
    if (!name || !description || !price || !category || !stock) {
        throw appError("Nhập đầy đủ thông tin sản phẩm!", 400);
    }

    // Validate hình ảnh
    if (!imageFiles || imageFiles.length === 0) {
        throw appError("Vui lòng tải lên hình ảnh sản phẩm!", 400);
    }

    // Kiểm tra sản phẩm đã tồn tại chưa
    const productExist = await productModel.findOne({ name: sanitizeText(name) });
    if (productExist) {
        throw appError("Sản phẩm đã tồn tại!", 400);
    }

    // Validate giá và tồn kho > 0
    if (price <= 0 || stock <= 0) {
        throw appError("Giá và số lượng tồn kho phải lớn hơn 0", 400);
    }

    // Upload ảnh lên Cloudinary (thư mục: guitar-shop/products)
    const imageUrls = await uploadImages(imageFiles, "guitar-shop/products");

    // Tạo sản phẩm mới trong database
    const newProduct = await productModel.create({
        name: sanitizeText(name),
        description: sanitizeText(description),
        price: formatPrice(price),
        category,
        stock: parseInt(stock),
        images: imageUrls
    });

    // Lấy thông tin category để trả về
    await newProduct.populate('category', 'name');

    // Trả về thông tin sản phẩm đã tạo
    return appSuccess(res, {
        statusCode: 201,
        message: "Tạo sản phẩm mới thành công!",
        data: {
            id: newProduct._id,
            name: newProduct.name,
            description: newProduct.description,
            category: newProduct.category,
            stock: newProduct.stock,
            images: newProduct.images,
            price: newProduct.price,
            createdAt: formatDateTime(newProduct.createdAt),
            updatedAt: formatDateTime(newProduct.updatedAt),
        }
    });
};


export const getAllProducts = async (req, res) => {
    const { page = 1,
        limit = 10,
        search, category,
        sortBy = 'createdAt',
        sortOrder = -1
    } = req.query;

    const filter = {};

    if (search) {
        filter.name = { $regex: search, $options: 'i' };
    }

    if (category) {
        filter.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await productModel
        .find(filter)
        .populate('category', 'name slug')
        .sort({ [sortBy]: parseInt(sortOrder) })
        .skip(skip)
        .limit(parseInt(limit));

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

export const getProductById = async (req, res) => {
    const { id } = req.params;

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

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock, images } = req.body;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

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

    if (price !== undefined && price <= 0) {
        throw appError("Giá phải lớn hơn 0", 400);
    }
    if (stock !== undefined && stock <= 0) {
        throw appError("Số lượng tồn kho phải lớn hơn 0", 400);
    }

    if (description) product.description = sanitizeText(description);
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;
    if (stock) product.stock = parseInt(stock);
    if (images) product.images = images;

    await product.save();

    await product.populate('category', 'name slug');

    return res.json(formatSuccessResponse(
        'Sản phẩm đã được cập nhật thành công!',
        product
    ));
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    await product.deleteOne();

    return res.json(formatSuccessResponse(
        'Sản phẩm đã được xóa thành công!'
    ));
};

export const searchProducts = async (req, res) => {
    const { keyword, minPrice, maxPrice, category, inStock } = req.query;

    const filter = {};

    if (keyword) {
        filter.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } }
        ];
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (category) {
        filter.category = category;
    }

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

export const uploadProductImages = async (req, res) => {
    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!req.files || req.files.length === 0) {
        throw appError("Không có tệp nào được tải lên!", 400);
    }

    const uploadedImages = await uploadImages(req.files, "guitar-shop/products");

    return res.status(201).json(formatSuccessResponse(
        'Hình ảnh đã được tải lên thành công!',
        { images: uploadedImages }
    ));
};

export const updateProductImages = async (req, res) => {
    const { id } = req.params;
    const { images } = req.body;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    if (!images || images.length === 0) {
        throw appError("Không có hình ảnh nào được cung cấp!", 400);
    }

    product.images = images;
    await product.save();

    await product.populate('category', 'name slug');

    return res.json(formatSuccessResponse(
        'Sản phẩm đã được cập nhật hình ảnh thành công!',
        product
    ));
};

export const addProductImages = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    if (!req.files || req.files.length === 0) {
        throw appError("Không có tệp nào được tải lên!", 400);
    }

    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    const uploadedImages = await uploadImages(req.files, "guitar-shop/products");

    product.images = [...product.images, ...uploadedImages];
    await product.save();

    await product.populate('category', 'name slug');

    return res.json(formatSuccessResponse(
        'Hình ảnh đã được thêm vào sản phẩm thành công!',
        product
    ));
};

export const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(categoryId)) {
        throw appError("ID danh mục không hợp lệ!", 400);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await productModel
        .find({ category: categoryId })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

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

export const updateStock = async (req, res) => {
    const { id } = req.params;
    const { quantity, action } = req.body;

    if (req.user.role !== 'admin') {
        throw appError("Chỉ admin mới có quyền!", 403);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    if (!quantity || quantity <= 0) {
        throw appError("Số lượng phải lớn hơn 0!", 400);
    }

    if (!action || !['increase', 'decrease'].includes(action)) {
        throw appError("Hành động không hợp lệ! (increase hoặc decrease)", 400);
    }

    const product = await productModel.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

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