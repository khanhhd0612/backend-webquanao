const mongoose = require('mongoose');
const { paginate, toJSON } = require("./plugins");

const couponUsageSchema = new mongoose.Schema(
    {
        couponId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        },
        usedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

couponUsageSchema.plugin(toJSON);
couponUsageSchema.plugin(paginate);

const CouponUsage = mongoose.model('CouponUsage', couponUsageSchema);

module.exports = CouponUsage;