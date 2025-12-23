const catchAsync = require('../utils/catchAsync');
const reviewService = require('../services/review.service');
const pick = require('../utils/pick');

const createReview = catchAsync(async (req, res) => {
    const review = await reviewService.createOrRestoreReview(req.user.id, req.body);
    res.status(201).json({ message: 'Đánh giá thành công', review });
});

const getReviewsByProduct = catchAsync(async (req, res) => {
    const result = await reviewService.getReviewsByProduct(req.params.productId);
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
    getReviewsByProduct,
    updateReview,
    deleteReview,
};
