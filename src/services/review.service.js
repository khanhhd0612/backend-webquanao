const Review = require('../models/review.model');
const ApiError = require('../utils/ApiError');

const createReview = async (userId, reviewBody) => {
    const review = await Review.create({ ...reviewBody, userId });
    return review;
};

const getReviews = async (filter, options) => {
    const reviews = await Review.paginate(filter, options);
    return reviews;
};

const updateReview = async (reviewId, userId, updateBody) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, 'Đánh giá không tồn tại.');
    if (review.userId.toString() !== userId)
        throw new ApiError(403, 'Bạn không thể chỉnh sửa đánh giá của người khác.');

    Object.assign(review, updateBody);
    await review.save();
    return review;
};

const deleteReview = async (reviewId, userId) => {
    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, 'Đánh giá không tồn tại.');
    if (review.userId.toString() !== userId)
        throw new ApiError(403, 'Bạn không thể xóa đánh giá của người khác.');

    await review.deleteOne();
    return;
};

module.exports = {
    createReview,
    getReviews,
    updateReview,
    deleteReview,
};
