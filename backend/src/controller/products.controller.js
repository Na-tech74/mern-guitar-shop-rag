import Product from "../models/product.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { uploadImages } from "../services/uploadImages.js";
import { formatDateTime, sanitizeText } from "../utils/format.js";
import { isValidObjectId } from "../utils/valid.js";

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

    // Validate thông tin bắt buộc
    if (!name || !description || !price || !category || !stock) {
        throw appError("Nhập đầy đủ thông tin sản phẩm!", 400);
    }

    // Validate hình ảnh
    if (!imageFiles || imageFiles.length === 0) {
        throw appError("Vui lòng tải lên hình ảnh sản phẩm!", 400);
    }

    // Kiểm tra sản phẩm đã tồn tại chưa
    const productExist = await Product.findOne({ name: sanitizeText(name) });
    if (productExist) {
        throw appError("Sản phẩm đã tồn tại!", 400);
    }

    // Validate giá và tồn kho > 0
    if (price <= 0 || stock <= 0) {
        throw appError("Giá và số lượng tồn kho phải lớn hơn 0", 400);
    }

    // Upload ảnh lên Cloudinary (thư mục: guitar-shop/products)
    const imageUrls = await uploadImages(imageFiles, "guitar-shop/products");
    const newProduct = await Product.create({
        name: sanitizeText(name),
        description: sanitizeText(description),
        price: Number(price),
        category,
        stock: parseInt(stock),
        images: imageUrls
    });

    // Lấy thông tin category để trả về
    // Hàm populate dùng để lấy dữ liệu từ collection khác
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

/**
 * Lấy tất cả sản phẩm (có phân trang)
 * @query {number} page - Số trang (default: 1)
 * @query {number} limit - Số sản phẩm/trang (default: 10)
 * @query {string} category - Lọc theo danh mục (tùy chọn)
 * @query {string} search - Tìm kiếm theo tên (tùy chọn)
 * @returns {200} Danh sách sản phẩm với thông tin phân trang
 */
export const getAllProducts = async (req, res) => {
    const { page = 1, limit = 8, category, search, sortBy } = req.query;

    const query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    let sortOption = {};
    if (sortBy === 'priceAsc') sortOption = { price: 1 };
    else if (sortBy === 'priceDESC') sortOption = { price: -1 };
    else if (sortBy === 'name') sortOption = { name: 1 };
    else sortOption = { createdAt: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .populate('category', 'name')
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy sản phẩm thành công!",
        data: {
            products,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        }
    });
};

/**
 * Lấy chi tiết sản phẩm theo ID
 * @param {string} id - ID sản phẩm từ params
 * @throws {400} ID không hợp lệ
 * @throws {404} Không tìm thấy sản phẩm
 * @returns {200} Thông tin sản phẩm
 */
export const getProductById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    const product = await Product.findById(id).populate('category', 'name');
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy sản phẩm thành công!",
        data: { product }
    });
};

/**
 * Cập nhật sản phẩm (Admin only)
 * @param {string} id - ID sản phẩm từ params
 * @param {string} name - Tên sản phẩm mới
 * @param {string} description - Mô tả mới
 * @param {number} price - Giá mới (> 0)
 * @param {string} category - ID danh mục mới
 * @param {number} stock - Số lượng tồn kho mới (> 0)
 * @param {File[]} images - Hình ảnh mới (tùy chọn)
 * @requires req.user.role = 'admin'
 * @throws {400} Thiếu thông tin | Giá/stock không hợp lệ
 * @throws {403} Không có quyền
 * @throws {404} Không tìm thấy sản phẩm
 * @returns {200} Sản phẩm đã cập nhật
 */
export const updateProducts = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock, images } = req.body;
    const imageFiles = req.files;

    if (!name || !description || !price || !category || !stock) {
        throw appError("Nhập đầy đủ thông tin sản phẩm!", 400);
    }

    if (price <= 0 || stock <= 0) {
        throw appError("Giá và số lượng tồn kho phải lớn hơn 0", 400);
    }

    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    const product = await Product.findById(id);
    if (!product) {
        throw appError("Không tìm thấy sản phẩm!", 404);
    }

    product.name = sanitizeText(name);
    product.description = sanitizeText(description);
    product.price = Number(price);
    product.category = category;
    product.stock = parseInt(stock);

    if (imageFiles && imageFiles.length > 0) {
        const imageUrls = await uploadImages(imageFiles, "guitar-shop/products");
        product.images = imageUrls;
    } else if (images) {
        product.images = images;
    }

    await product.save();

    await product.populate('category', 'name');

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật sản phẩm thành công!",
        data: { product }
    });
};

/**
 * Xóa sản phẩm (Admin only)
 * @param {string} id - ID sản phẩm từ params
 * @requires req.user.role = 'admin'
 * @throws {403} Không có quyền
 * @throws {404} Không tìm thấy sản phẩm
 * @returns {200} Xóa thành công
 */
export const deleteProducts = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    const product = await Product.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    await Product.findByIdAndDelete(id);

    return appSuccess(res, {
        statusCode: 200,
        message: "Xóa sản phẩm thành công!"
    });
};

/**
 * Lấy danh sách sản phẩm nổi bật (top products)
 * @query {number} limit -  phẩm lấy ra (default: 3)
 * @query {string} sortBy - Tiêu chí sắp xếp: 'sales' | 'priceDESC' | 'priceAsc' (default: 'sales')
 * @returns {200} Danh sách sản phẩm nổi bật
 */
export const searchProductsTop = async (req, res) => {
    const { limit = 3, sortBy = 'sales' } = req.query;

    let sortOption = {};

    switch (sortBy) {
        case 'priceDESC': //Gía từ cao -> thấp
            sortOption = { price: -1 };
            break;
        case 'priceAsc': // Gía từ thấp -> cao
            sortOption = { price: 1 };
            break;
        case 'sales':
        default:
            // Mặc định sản phẩm bán nhiều nhất
            sortOption = { sold: -1 };
    }

    const products = await Product.find()
        .populate('category', 'name')
        .sort(sortOption)
        .limit(parseInt(limit));

    if (!products) {
        throw appError("Không tìm thấy sản phẩm nổi bật!", 404);
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy sản phẩm nổi bật thành công!",
        data: { products }
    });
};

/**
 * Upload ảnh cho sản phẩm (Admin only)
 * @param {string} id - ID sản phẩm từ params
 * @param {File[]} images - Hình ảnh từ req.files
 */
export const uploadProductImages = async (req, res) => {
    const { id } = req.params;
    const imageFiles = req.files;

    if (!isValidObjectId(id)) {
        throw appError("ID sản phẩm không hợp lệ!", 400);
    }

    if (!imageFiles || imageFiles.length === 0) {
        throw appError("Vui lòng tải lên hình ảnh sản phẩm!", 400);
    }

    const product = await Product.findById(id);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404);
    }

    const imageUrls = await uploadImages(imageFiles, "guitar-shop/products");
    product.images = [...(product.images || []), ...imageUrls];
    await product.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Tải ảnh lên thành công!",
        data: { images: product.images }
    });
};
