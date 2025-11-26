const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const couponValidation = require('../../validations/coupon.validation');
const couponController = require('../../controllers/coupon.controller');

const router = express.Router();

router.post('/', auth('manager'), validate(couponValidation.createCoupon), couponController.createCoupon);

router.get('/', auth('manager'), couponController.queryCoupon);

router.get('/:couponId', auth('manager'), validate(couponValidation.getCouponById), couponController.getCouponById);

router.put('/:couponId', auth('manager'), validate(couponValidation.updateCoupon), couponController.updateCoupon);

router.delete('/:couponId', auth('manager'), validate(couponValidation.getCouponById), couponController.deleteCoupon);

router.patch('/:couponId', auth('manager'), validate(couponValidation.getCouponById), couponController.setCouponStatus);

router.post('/apply', auth(), validate(couponValidation.applyCoupon), couponController.applyCoupon);

module.exports = router;