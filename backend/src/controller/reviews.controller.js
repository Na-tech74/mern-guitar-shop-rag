import Review from "../models/reviews.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import { appError, appSuccess } from "../utils/appResponse.js";
import { isValidObjectId } from "../utils/valid.js";
import { formatDateTime, sanitizeText } from "../utils/format.js";

/**
 * Tạo đánh giá sản phẩm (User đã mua hàng)
 * @body {number} rating - Số sao (1-5, bắt buộc)
 * @body {string} productId - ID sản phẩm (bắt buộc)
 * @body {string} title - Tiêu đề (tùy chọn)
 * @body {string} comment - Nội dung (bắt buộc)
 * @requires req.user - Đã đăng nhập
 * @throws {400} Thiếu thông tin | Đã review | Chưa mua hàng
 * @throws {404} Sản phẩm không tồn tại
 * @returns {201} Review vừa tạo
 */

export const createReview = async (req, res) => {

    const { rating, productId, title, comment } = req.body;
    const userId = req.user._id

    if (!rating || !title || !comment) {
        throw appError(" Vui lòng điền đầy đủ nội dung !", 400);
    };

    if (rating < 1 || rating > 5) {
        throw appError("  Đánh giá từ 1 đến 5 sao !", 400);
    };

    if (!isValidObjectId(productId)) {
        throw appError(" ID sản phầm không hợp lệ !", 400)
    };
    const product = await Product.findById(productId);
    if (!product) {
        throw appError("Sản phẩm không tồn tại!", 404)
    };

    const existingReview = await Review.findOne({
        user: userId,
        Product: productId
    });
    if (existingReview) {
        throw appError("Bạn đã đánh giá sản phẩm này !", 400)
    };

    const purchased = await Order.findOne({
        user: userId,// Đơn hàng phải thuộc về user hiện tại (ObjectId từ token)
        "items.productId": productId,//Trong danh sách sản phẩm của đơn hàng phải có sản phẩm này 
        status: "delivered"//Đơn hàng phải ở trạng thái đã giao thành công 
    });
    if (!purchased) {
        throw appError("Bạn cần mua hàng để đánh giá sản phẩm !", 400)
    };

    const review = await Review.create({
        user: userId,
        product: productId,
        rating: rating,
        title: sanitizeText(title),
        comment: sanitizeText(comment)
    });

    await review.populate('user', 'name avatar')

    // Tính toán thống kê rating từ tất cả reviews của sản phẩm:
    const stats = await Review.aggregate([
        //Lọc tất cả reviews của sản phẩm vừa được review (ObjectId)
        { $match: { product: review.product } },
        {
            //Gom chung 1 nhóm (vì _id: null) để tính trên toàn bộ kết quả
            $group: {
                _id: null,
                // Trung bình cộng field rating của tất cả reviews
                avgRating: {
                    $avg: "$rating"
                },
                // Tổng số review
                count: { $sum: 1 }
            }
        }
    ]);
    if (stats.length > 0) {
        //Làm tròn avgRating đến 1 chữ số thập phân. VD: 4.333... → 43.33 → 43 → 4.3
        product.ratings = Math.round(stats[0].avgRating * 10) / 10;
        // Số lượng review — $sum: 1 đếm từng review. VD: có 12 review → count = 12
        product.numReviews = stats[0].count;
    } else {
        product.ratings = 0;
        product.numReview = 0;
    }
    await product.save();
    return appSuccess(res, {
        statusCode: 201,
        message: "Đánh giá sản phẩm thành công!",
        data: {
            id: review._id,
            user: review.user,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            createdAt: formatDateTime(review.createdAt)
        }
    });
};

// lấy tất cả bái đánh giá 
export const getAllReviews = async (req, res) => {
    const review = await Review.find()
    if (!review) {
        throw appError("Không tìm thấy bài đánh giá nào !", 404);
    };
    return appSuccess(res, {
        statusCode: 200,
        message: "Lấy danh mục thành công !",
        data: { review }
    })
};

// update bài đánh giá
export const updateReviews = async (req, res) => {
    const id = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.user._id

    if (!isValidObjectId(userId)) {
        throw appError("ID không hợp lệ !", 400);
    };
    const review = await Review.findById(id);
    if (!review) {
        throw appError("Bài đánh giá này không tồn tại !", 404);
    }

    if (review.user.toString() !== userId.toString()) {
        throw appError("Bạn không có quyền chỉnh sửa bài đánh giá này ", 403)
    }
    if (!rating && (rating > 1 || rating < 5)) {
        throw appError("Đánh giá sản phầm từ 1 đến 5 sao ", 400)
    }
    if (!rating) { rewview.rating = rating };
    if (!title) { review.title = sanitizeText(title) };
    if (!comment) { review.comment = sanitizeText(title) };
}