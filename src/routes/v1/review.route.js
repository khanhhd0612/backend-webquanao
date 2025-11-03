const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router.post('/', auth(), validate(reviewValidation.createReview), reviewController.createReview);

router.get('/', validate(reviewValidation.getReviews), reviewController.getReviews);

router.put('/:reviewId', auth(), validate(reviewValidation.updateReview), reviewController.updateReview);

router.delete('/:reviewId', auth(), validate(reviewValidation.getReview), reviewController.deleteReview);

module.exports = router;