const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        discountType: {
            type: String,
            enum: ["percent", "fixed", "shipping"],
            required: true
        },

        // Giá trị giảm
        value: {
            type: Number,
            required: true
        },

        maxDiscount: {
            type: Number,
            default: 0
        },

        // Điều kiện tối thiểu
        minOrderValue: {
            type: Number,
            default: 0
        },

        // Thời gian áp dụng
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },

        // Số lần sử dụng tối đa
        usageLimit: {
            type: Number,
            default: 0 // 0 = không giới hạn
        },

        // Đã được dùng bao nhiêu lần
        usedCount: {
            type: Number,
            default: 0
        },

        // 1 user được dùng tối đa bao nhiêu lần
        userLimit: {
            type: Number,
            default: 1
        },

        status: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

couponSchema.plugin(toJSON);
couponSchema.plugin(paginate);

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;