const Review = require('../models/review.model');
const ApiError = require('../utils/ApiError');

const createOrRestoreReview = async (userId, reviewBody) => {
    const { productId, rating, comment = '' } = reviewBody;

    if (rating < 1 || rating > 5) {
        throw new ApiError(400, 'Số sao đánh giá phải từ 1 đến 5');
    }

    const existingReview = await Review.findOne({ productId, userId });

    if (!existingReview) {
        const review = await Review.create({
            productId,
            userId,
            rating,
            comment,
        });

        return review;
    }

    if (!existingReview.isDeleted) {
        throw new ApiError(400, 'Bạn đã đánh giá sản phẩm này rồi');
    }

    existingReview.rating = rating;
    existingReview.comment = comment;
    existingReview.isDeleted = false;

    await existingReview.save();

    return existingReview;
};

const getReviewsByProduct = async (productId, options = {}) => {
    const { sortBy = '-createdAt', limit = 10, page = 1, status } = options;

    const filter = {
        productId: productId,
        isDeleted: false
    };

    const reviews = await Review.find(filter)
        .sort(sortBy)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('userId', 'name avatar');

    const total = await Review.countDocuments(filter);
    return {
        results: reviews,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
    };
};

const updateReview = async (reviewId, userId, updateBody) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, 'Đánh giá không tồn tại.');
    if (review.userId.toString() !== userId)
        throw new ApiError(403, 'Bạn không thể chỉnh sửa đánh giá của người khác.');

    if (updateBody.comment !== undefined) {
        review.comment = updateBody.comment;
    }

    if (updateBody.rating !== undefined) {
        if (updateBody.rating < 1 || updateBody.rating > 5) {
            throw new ApiError(400, 'Số sao đánh giá phải từ 1 đến 5');
        }
        review.rating = updateBody.rating;
    }

    await review.save();
    return review;
};

const deleteReview = async (reviewId, userId) => {
    const review = await Review.findById(reviewId);

    if (!review || review.isDeleted) {
        throw new ApiError(404, 'Đánh giá không tồn tại.');
    }

    if (review.userId.toString() !== userId)
        throw new ApiError(403, 'Bạn không thể xóa đánh giá của người khác.');

    review.isDeleted = true;
    await review.save();

    return;
};

module.exports = {
    createOrRestoreReview,
    getReviewsByProduct,
    updateReview,
    deleteReview,
};
