const catchAsync = require('../utils/catchAsync');
const reviewService = require('../services/review.service');

const createReview = catchAsync(async (req, res) => {
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json({ message: 'Đánh giá thành công', review });
});

const getReviews = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['productId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await reviewService.getReviews(filter, options);
    res.status(200).json(result);
});

const updateReview = catchAsync(async (req, res) => {
    const review = await reviewService.updateReview(req.params.reviewId, req.user.id, req.body);
    res.status(200).json({ message: 'Cập nhật đánh giá thành công', review });
});

const deleteReview = catchAsync(async (req, res) => {
    await reviewService.deleteReview(req.params.reviewId, req.user.id);
    res.status(200).json({ message: 'Xóa đánh giá thành công' });
});

module.exports = {
    createReview,
    getReviews,
    updateReview,
    deleteReview,
};
