const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCoupon = {
    body: Joi.object().keys({
        code: Joi.string().trim().uppercase().required().messages({
            'string.base': 'Mã coupon phải là chuỗi',
            'string.empty': 'Mã coupon không được để trống',
            'any.required': 'Mã coupon là bắt buộc'
        }),

        discountType: Joi.string()
            .valid('percent', 'fixed', 'shipping')
            .required()
            .messages({
                'string.base': 'Loại giảm giá phải là chuỗi',
                'any.only': 'Loại giảm giá chỉ có thể là percent, fixed hoặc shipping',
                'any.required': 'Loại giảm giá là bắt buộc'
            }),

        value: Joi.number().positive().required().messages({
            'number.base': 'Giá trị giảm phải là số',
            'number.positive': 'Giá trị giảm phải lớn hơn 0',
            'any.required': 'Giá trị giảm là bắt buộc'
        }),

        maxDiscount: Joi.number().min(0).default(0).messages({
            'number.base': 'Giảm giá tối đa phải là số',
            'number.min': 'Giảm giá tối đa không được nhỏ hơn 0'
        }),

        minOrderValue: Joi.number().min(0).default(0).messages({
            'number.base': 'Giá trị đơn hàng tối thiểu phải là số',
            'number.min': 'Giá trị đơn hàng tối thiểu không được nhỏ hơn 0'
        }),

        startDate: Joi.date().required().messages({
            'date.base': 'Ngày bắt đầu phải là ngày hợp lệ',
            'any.required': 'Ngày bắt đầu là bắt buộc'
        }),

        endDate: Joi.date()
            .greater(Joi.ref('startDate'))
            .required()
            .messages({
                'date.base': 'Ngày kết thúc phải là ngày hợp lệ',
                'date.greater': 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
                'any.required': 'Ngày kết thúc là bắt buộc'
            }),

        usageLimit: Joi.number().min(0).default(0).messages({
            'number.base': 'Giới hạn số lần sử dụng phải là số',
            'number.min': 'Giới hạn số lần sử dụng không được nhỏ hơn 0'
        }),

        usedCount: Joi.number().min(0).default(0).messages({
            'number.base': 'Số lần đã sử dụng phải là số',
            'number.min': 'Số lần đã sử dụng không được nhỏ hơn 0'
        }),

        userLimit: Joi.number().min(1).default(1).messages({
            'number.base': 'Giới hạn mỗi người dùng phải là số',
            'number.min': 'Giới hạn mỗi người dùng phải lớn hơn hoặc bằng 1'
        }),

        status: Joi.boolean().default(true).messages({
            'boolean.base': 'Trạng thái phải là kiểu boolean'
        })
    })
};

const updateCoupon = {
    params: Joi.object({
        couponId: Joi.string().custom(objectId).required().messages({
            'string.base': 'ID coupon phải là chuỗi',
            'string.empty': 'ID coupon không được để trống',
            'any.required': 'ID coupon là bắt buộc',
            'string.custom': 'ID coupon không hợp lệ'
        })
    }),
    body: Joi.object().keys({
        code: Joi.string().trim().uppercase().messages({
            'string.base': 'Mã coupon phải là chuỗi',
            'string.empty': 'Mã coupon không được để trống'
        }),

        discountType: Joi.string().valid('percent', 'fixed', 'shipping').messages({
            'string.base': 'Loại giảm giá phải là chuỗi',
            'any.only': 'Loại giảm giá chỉ có thể là percent, fixed hoặc shipping'
        }),

        value: Joi.number().positive().messages({
            'number.base': 'Giá trị giảm phải là số',
            'number.positive': 'Giá trị giảm phải lớn hơn 0'
        }),

        maxDiscount: Joi.number().min(0).messages({
            'number.base': 'Giảm giá tối đa phải là số',
            'number.min': 'Giảm giá tối đa không được nhỏ hơn 0'
        }),

        minOrderValue: Joi.number().min(0).messages({
            'number.base': 'Giá trị đơn hàng tối thiểu phải là số',
            'number.min': 'Giá trị đơn hàng tối thiểu không được nhỏ hơn 0'
        }),

        startDate: Joi.date().messages({
            'date.base': 'Ngày bắt đầu phải là ngày hợp lệ'
        }),

        endDate: Joi.date().greater(Joi.ref('startDate')).messages({
            'date.base': 'Ngày kết thúc phải là ngày hợp lệ',
            'date.greater': 'Ngày kết thúc phải lớn hơn ngày bắt đầu'
        }),

        usageLimit: Joi.number().min(0).messages({
            'number.base': 'Giới hạn số lần sử dụng phải là số',
            'number.min': 'Giới hạn số lần sử dụng không được nhỏ hơn 0'
        }),

        usedCount: Joi.number().min(0).messages({
            'number.base': 'Số lần đã sử dụng phải là số',
            'number.min': 'Số lần đã sử dụng không được nhỏ hơn 0'
        }),

        userLimit: Joi.number().min(1).messages({
            'number.base': 'Giới hạn mỗi người dùng phải là số',
            'number.min': 'Giới hạn mỗi người dùng phải lớn hơn hoặc bằng 1'
        }),

        status: Joi.boolean().messages({
            'boolean.base': 'Trạng thái phải là kiểu boolean'
        })
    }).min(1).messages({
        'object.min': 'Vui lòng cung cấp ít nhất một trường để cập nhật coupon'
    })
};

const getCouponById = {
    params: Joi.object({
        couponId: Joi.string().custom(objectId).required().messages({
            'string.base': 'ID coupon phải là chuỗi',
            'string.empty': 'ID coupon không được để trống',
            'any.required': 'ID coupon là bắt buộc',
            'string.custom': 'ID coupon không hợp lệ'
        })
    })
};

const applyCoupon = {
    body: Joi.object().keys({
        code: Joi.string().trim().uppercase().required().messages({
            'string.base': 'Mã coupon phải là chuỗi',
            'string.empty': 'Mã coupon không được để trống',
            'any.required': 'Mã coupon là bắt buộc'
        }),

        price: Joi.number().min(0).required().messages({
            'number.base': 'Giá trị đơn hàng phải là số',
            'number.min': 'Giá trị đơn hàng không được nhỏ hơn 0',
            'any.required': 'Giá trị đơn hàng là bắt buộc'
        }),

        shippingFee: Joi.number().min(0).required().messages({
            'number.base': 'Phí vận chuyển phải là số',
            'number.min': 'Phí vận chuyển không được nhỏ hơn 0',
            'any.required': 'Phí vận chuyển là bắt buộc'
        })
    })
};

module.exports = {
    createCoupon,
    updateCoupon,
    getCouponById,
    applyCoupon
};
