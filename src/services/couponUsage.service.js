const ApiError = require('../utils/ApiError');
const CouponUsage = require('../models/couponUsage.model');

const checkOutWithCoupon = async (userId, orderId, couponId, discount) => {
    const couponUsage = await CouponUsage.create({
        couponId,
        discount,
        userId,
        orderId
    });
    return couponUsage;
}
module.exports = {
    checkOutWithCoupon,
};
