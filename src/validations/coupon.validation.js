const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCoupon = {
    body: Joi.object().keys({
        code: Joi.string().trim().uppercase().required(),
        discountType: Joi.string().valid("percent", "fixed", "shipping").required(),
        value: Joi.number().positive().required(),
        maxDiscount: Joi.number().min(0).default(0),
        minOrderValue: Joi.number().min(0).default(0),
        startDate: Joi.date().required(),
        endDate: Joi.date().required().greater(Joi.ref("startDate")),
        usageLimit: Joi.number().min(0).default(0),
        usedCount: Joi.number().min(0).default(0),
        userLimit: Joi.number().min(1).default(1),
        status: Joi.boolean().default(true)
    })
}
const updateCoupon = {
    params: Joi.object({
        couponId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object().keys({
        code: Joi.string().trim().uppercase(),
        discountType: Joi.string().valid("percent", "fixed", "shipping"),
        value: Joi.number().positive(),
        maxDiscount: Joi.number().min(0),
        minOrderValue: Joi.number().min(0),
        startDate: Joi.date(),
        endDate: Joi.date().greater(Joi.ref("startDate")),
        usageLimit: Joi.number().min(0),
        usedCount: Joi.number().min(0),
        userLimit: Joi.number().min(1),
        status: Joi.boolean()
    }).min(1)
};

const getCouponById = {
    params: Joi.object({
        couponId: Joi.string().custom(objectId).required(),
    })
}

const applyCoupon = {
    body: Joi.object().keys({
        code: Joi.string().trim().uppercase(),
        price: Joi.number(),
        shippingFee: Joi.number(),
    })
}

module.exports = {
    createCoupon,
    updateCoupon,
    getCouponById,
    applyCoupon
}