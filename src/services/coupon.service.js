const Coupon = require('../models/coupon.model');
const CouponUsage = require('../models/couponUsage.model');
const ApiError = require('../utils/ApiError');

const checkCouponExists = async (couponId) => {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
        throw new ApiError(404, 'Mã giảm giá không tồn tại')
    }
    return coupon;
};

const createCoupon = async (body) => {
    const coupon = await Coupon.create(body);
    return coupon;
};

const queryCoupons = async (filter, options) => {
    const coupons = await Coupon.paginate(filter, options);
    return coupons;
};

const getCouponById = async (couponId) => {
    const coupon = await checkCouponExists(couponId);
    return coupon;
};

const updateCoupon = async (couponId, updateBody) => {
    const coupon = await checkCouponExists(couponId);

    Object.assign(coupon, updateBody);
    await coupon.save();
    return coupon;
};

const deleteCoupon = async (couponId) => {
    const coupon = await checkCouponExists(couponId);

    await coupon.deleteOne();
    return;
};

const setCouponStatus = async (couponId) => {
    const coupon = await checkCouponExists(couponId);

    coupon.status = !coupon.status;

    await coupon.save();
    return coupon;
}

const applyCoupon = async (code, userId, price, shippingFee) => {
    let discountPrice = 0;
    let shippingDiscount = 0;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
        throw new ApiError(404, 'Mã giảm giá không tồn tại');
    }

    if (!coupon.status) {
        throw new ApiError(404, 'Mã giảm giá không hoạt động');
    }
    if (Date.now() < coupon.startDate) {
        throw new ApiError(400, 'Mã giảm giá chưa bắt đầu');
    }

    if (Date.now() > coupon.endDate) {
        throw new ApiError(400, 'Mã giảm giá đã hết hạn');
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        throw new ApiError(404, 'Mã giảm giá đã hết lượt sử dụng');
    }

    const totalUsage = await CouponUsage.countDocuments({
        userId,
        couponId: coupon._id
    });

    if (totalUsage >= coupon.userLimit) {
        throw new ApiError(404, 'Bạn đã hết lượt sử dụng mã này');
    }

    if (coupon.minOrderValue > price) {
        throw new ApiError(400, `Đơn tối thiểu phải từ ${coupon.minOrderValue}`);
    }

    if (coupon.discountType === 'percent') {
        const rawDiscount = (price * coupon.value) / 100;
        discountPrice = coupon.maxDiscount ? Math.min(rawDiscount, coupon.maxDiscount) : rawDiscount;
    } else if (coupon.discountType === 'fixed') {
        discountPrice = Math.min(coupon.value, price);
    } else if (coupon.discountType === 'shipping') {
        shippingDiscount = Math.min(shippingFee, coupon.value);
    } else {
        throw new ApiError(400, 'Loại giảm giá không hợp lệ');
    }

    discountPrice = Math.min(discountPrice, price);

    const finalPrice = Math.max(0, price - discountPrice);
    const finalShipping = Math.max(0, shippingFee - shippingDiscount);

    return {
        discountPrice,
        shippingDiscount,
        finalPrice,
        finalShipping,
        couponId: coupon._id,
        totalAmount: finalPrice + finalShipping
    };
};

module.exports = {
    createCoupon,
    queryCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    applyCoupon,
    setCouponStatus
}