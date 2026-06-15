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
