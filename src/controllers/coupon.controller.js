const couponService = require('../services/coupon.service');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const createCoupon = catchAsync(async (req, res) => {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json({
        message: 'Tạo thành công',
        coupon
    });
})

const queryCoupon = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['code', 'status']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const coupons = await couponService.queryCoupons(filter, options);

    res.json(coupons);
})

const getCouponById = catchAsync(async (req, res) => {
    const coupon = await couponService.getCouponById(req.params.couponId);
    res.json(coupon);
})

const updateCoupon = catchAsync(async (req, res) => {
    const coupon = await couponService.updateCoupon(req.params.couponId, req.body);
    res.status(200).json({
        message: 'Cập nhật thành công',
        coupon
    });
})

const deleteCoupon = catchAsync(async (req, res) => {
    await couponService.deleteCoupon(req.params.couponId);
    res.status(204).send();
})

const applyCoupon = catchAsync(async (req, res) => {
    const userId = req.user.id
    const { code, price, shippingFee } = req.body;
    const result = await couponService.applyCoupon(code, userId, price, shippingFee);

    return res.status(200).json({
        message: "Áp dụng coupon thành công",
        result
    });
})

const setCouponStatus = catchAsync(async (req, res) => {
    const coupon = await couponService.setCouponStatus(req.params.couponId);
    res.status(200).json({
        message: 'Cập nhật thành công',
        coupon
    });
})

module.exports = {
    createCoupon,
    queryCoupon,
    getCouponById,
    updateCoupon,
    setCouponStatus,
    applyCoupon,
    deleteCoupon,
}