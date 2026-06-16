/**
 * coupon.controller.js
 * Xử lý các API liên quan đến mã giảm giá: tạo, lấy danh sách, lấy chi tiết, cập nhật, xóa
 */

import Coupon from "../models/coupon.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { isValidObjectId } from "../utils/valid.js";
import { formatDateTime, sanitizeText } from "../utils/format.js";

/**
 * Tạo mã giảm giá mới (Admin only)
 * @param {string} code - Mã giảm giá (bắt buộc, duy nhất)
 * @param {string} type - Loại giảm giá: percentage | fixed | free_shipping (bắt buộc)
 * @param {number} value - Giá trị giảm (bắt buộc)
 * @param {number} minOrderValue - Đơn hàng tối thiểu (mặc định 0)
 * @param {number} maxDiscount - Giới hạn giảm tối đa (mặc định 0)
 * @param {number} usageLimit - Tổng lượt sử dụng tối đa (mặc định 0 = không giới hạn)
 * @param {number} perUserLimit - Số lần mỗi user được dùng (mặc định 1)
 * @param {string} startDate - Ngày bắt đầu (bắt buộc)
 * @param {string} endDate - Ngày kết thúc (bắt buộc)
 * @param {boolean} isActive - Trạng thái kích hoạt (mặc định true)
 * @param {string[]} applicableProducts - Danh sách ID sản phẩm được áp dụng
 * @param {string[]} applicableCategories - Danh sách ID danh mục được áp dụng
 * @requires req.user.role = 'admin'
 * @throws {400} Thiếu thông tin | Mã đã tồn tại | Loại không hợp lệ
 * @returns {201} Mã giảm giá vừa tạo
 */
export const createCoupon = async (req, res) => {
    const {
        code, type, value, minOrderValue, maxDiscount,
        usageLimit, perUserLimit, startDate, endDate, isActive,
        applicableProducts, applicableCategories
    } = req.body;

    if (!code || !type || value === undefined || !startDate || !endDate) {
        throw appError("Vui lòng nhập đầy đủ thông tin mã giảm giá!", 400);
    }

    const validTypes = ["percentage", "fixed", "free_shipping"];
    if (!validTypes.includes(type)) {
        throw appError("Loại giảm giá không hợp lệ!", 400);
    }

    const existingCoupon = await Coupon.findOne({ code: sanitizeText(code).toUpperCase() });
    if (existingCoupon) {
        throw appError("Mã giảm giá đã tồn tại!", 400);
    }

    if (new Date(startDate) >= new Date(endDate)) {
        throw appError("Ngày kết thúc phải sau ngày bắt đầu!", 400);
    }

    const coupon = await Coupon.create({
        code: sanitizeText(code).toUpperCase(),
        type,
        value: Number(value),
        minOrderValue: Number(minOrderValue) || 0,
        maxDiscount: Number(maxDiscount) || 0,
        usageLimit: Number(usageLimit) || 0,
        perUserLimit: Number(perUserLimit) || 1,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive !== undefined ? isActive : true,
        applicableProducts: applicableProducts || [],
        applicableCategories: applicableCategories || [],
    });

    return appSuccess(res, {
        statusCode: 201,
        message: "Tạo mã giảm giá thành công!",
        data: {
            id: coupon._id,
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            minOrderValue: coupon.minOrderValue,
            maxDiscount: coupon.maxDiscount,
            usageLimit: coupon.usageLimit,
            usedCount: coupon.usedCount,
            perUserLimit: coupon.perUserLimit,
            startDate: formatDateTime(coupon.startDate),
            endDate: formatDateTime(coupon.endDate),
            isActive: coupon.isActive,
            applicableProducts: coupon.applicableProducts,
            applicableCategories: coupon.applicableCategories,
            createdAt: formatDateTime(coupon.createdAt),
            updatedAt: formatDateTime(coupon.updatedAt),
        }
    });
};

/**
 * Lấy danh sách tất cả mã giảm giá (Admin only)
 * Hỗ trợ phân trang và tìm kiếm theo mã
 * @param {number} page - Số trang (mặc định 1)
 * @param {number} limit - Số lượng mỗi trang (mặc định 10)
 * @param {string} search - Tìm kiếm theo mã
 * @param {string} type - Lọc theo loại
 * @param {string} isActive - Lọc theo trạng thái
 * @returns {200} Danh sách mã giảm giá
 */
export const getAllCoupons = async (req, res) => {
    const { page = 1, limit = 10, search, type, isActive } = req.query;

    const query = {};

    if (search) {
        query.code = { $regex: search, $options: "i" };
    }

    if (type && ["percentage", "fixed", "free_shipping"].includes(type)) {
        query.type = type;
    }

    if (isActive !== undefined) {
        query.isActive = isActive === "true";
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [coupons, total] = await Promise.all([
        Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate("applicableProducts", "name")
            .populate("applicableCategories", "name"),
        Coupon.countDocuments(query),
    ]);

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh sách mã giảm giá thành công!",
        data: {
            coupons,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum),
            }
        }
    });
};

/**
 * Lấy chi tiết mã giảm giá theo ID (Admin only)
 * @param {string} id - ID mã giảm giá (params)
 * @throws {400} ID không hợp lệ
 * @throws {404} Mã giảm giá không tồn tại
 * @returns {200} Chi tiết mã giảm giá
 */
export const getCouponById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID không hợp lệ!", 400);
    }

    const coupon = await Coupon.findById(id)
        .populate("applicableProducts", "name")
        .populate("applicableCategories", "name");

    if (!coupon) {
        throw appError("Mã giảm giá không tồn tại!", 404);
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy chi tiết mã giảm giá thành công!",
        data: { coupon }
    });
};

/**
 * Cập nhật mã giảm giá (Admin only)
 * @param {string} id - ID mã giảm giá (params)
 * @param {object} body - Các trường cần cập nhật
 * @requires req.user.role = 'admin'
 * @throws {400} ID không hợp lệ | Ngày không hợp lệ
 * @throws {404} Mã giảm giá không tồn tại
 * @returns {200} Mã giảm giá đã cập nhật
 */
export const updateCoupon = async (req, res) => {
    const { id } = req.params;
    const {
        code, type, value, minOrderValue, maxDiscount,
        usageLimit, perUserLimit, startDate, endDate, isActive,
        applicableProducts, applicableCategories
    } = req.body;

    if (!isValidObjectId(id)) {
        throw appError("ID không hợp lệ!", 400);
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
        throw appError("Mã giảm giá không tồn tại!", 404);
    }

    if (code && code.toUpperCase() !== coupon.code) {
        const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
        if (existing) {
            throw appError("Mã giảm giá đã tồn tại!", 400);
        }
        coupon.code = code.toUpperCase().trim();
    }

    if (type) {
        const validTypes = ["percentage", "fixed", "free_shipping"];
        if (!validTypes.includes(type)) {
            throw appError("Loại giảm giá không hợp lệ!", 400);
        }
        coupon.type = type;
    }

    if (value !== undefined) coupon.value = Number(value);
    if (minOrderValue !== undefined) coupon.minOrderValue = Number(minOrderValue);
    if (maxDiscount !== undefined) coupon.maxDiscount = Number(maxDiscount);
    if (usageLimit !== undefined) coupon.usageLimit = Number(usageLimit);
    if (perUserLimit !== undefined) coupon.perUserLimit = Number(perUserLimit);

    if (startDate || endDate) {
        const sDate = startDate ? new Date(startDate) : coupon.startDate;
        const eDate = endDate ? new Date(endDate) : coupon.endDate;
        if (sDate >= eDate) {
            throw appError("Ngày kết thúc phải sau ngày bắt đầu!", 400);
        }
        if (startDate) coupon.startDate = sDate;
        if (endDate) coupon.endDate = eDate;
    }

    if (isActive !== undefined) coupon.isActive = isActive === true || isActive === "true";
    if (applicableProducts !== undefined) coupon.applicableProducts = applicableProducts;
    if (applicableCategories !== undefined) coupon.applicableCategories = applicableCategories;

    await coupon.save();

    return appSuccess(res, {
        statusCode: 200,
        message: "Cập nhật mã giảm giá thành công!",
        data: { coupon }
    });
};

/**
 * Xóa mã giảm giá (Admin only)
 * @param {string} id - ID mã giảm giá (params)
 * @requires req.user.role = 'admin'
 * @throws {400} ID không hợp lệ
 * @throws {404} Mã giảm giá không tồn tại
 * @returns {200} Thông báo xóa thành công
 */
/**
 * Áp dụng mã giảm giá (Public)
 * Kiểm tra mã hợp lệ, còn hạn, chưa hết lượt dùng
 * @param {string} code - Mã giảm giá (body)
 * @param {number} orderValue - Giá trị đơn hàng (body, tùy chọn)
 * @returns {200} Thông tin giảm giá
 */
/**
 * Lấy danh sách mã giảm giá đang hoạt động (Public)
 * Trả về các mã còn hạn, đang active, chưa hết lượt
 */
export const getActiveCoupons = async (req, res) => {
    const now = new Date();

    const coupons = await Coupon.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
        $expr: {
            $or: [
                { $eq: ["$usageLimit", 0] },
                { $lt: ["$usedCount", "$usageLimit"] },
            ]
        }
    }).select("code type value maxDiscount minOrderValue endDate").sort({ createdAt: -1 }).limit(10);

    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh sách mã giảm giá thành công!",
        data: { coupons }
    });
};

export const applyCoupon = async (req, res) => {
    const { code, orderValue = 0 } = req.body;

    if (!code) {
        throw appError("Vui lòng nhập mã giảm giá!", 400);
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) {
        throw appError("Mã giảm giá không tồn tại!", 404);
    }

    if (!coupon.isActive) {
        throw appError("Mã giảm giá đã bị vô hiệu hóa!", 400);
    }

    const now = new Date();
    if (now < coupon.startDate) {
        throw appError("Mã giảm giá chưa đến hạn sử dụng!", 400);
    }
    if (now > coupon.endDate) {
        throw appError("Mã giảm giá đã hết hạn!", 400);
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        throw appError("Mã giảm giá đã hết lượt sử dụng!", 400);
    }

    if (orderValue > 0 && orderValue < coupon.minOrderValue) {
        throw appError(`Đơn hàng tối thiểu ${coupon.minOrderValue.toLocaleString()}đ để áp dụng mã này!`, 400);
    }

    let discountAmount = 0;
    if (coupon.type === "percentage") {
        discountAmount = (orderValue * coupon.value) / 100;
        if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }
    } else if (coupon.type === "fixed") {
        discountAmount = coupon.value;
    }

    return appSuccess(res, {
        statusCode: 200,
        message: "Áp dụng mã giảm giá thành công!",
        data: {
            coupon: {
                _id: coupon._id,
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                maxDiscount: coupon.maxDiscount,
                minOrderValue: coupon.minOrderValue,
                discountAmount,
            }
        }
    });
};

export const deleteCoupon = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw appError("ID không hợp lệ!", 400);
    }

    const coupon = await Coupon.findById(id);
    if (!coupon) {
        throw appError("Mã giảm giá không tồn tại!", 404);
    }

    await coupon.deleteOne();

    return appSuccess(res, {
        statusCode: 200,
        message: "Mã giảm giá đã được xóa!",
    });
};
