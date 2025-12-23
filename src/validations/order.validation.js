const Joi = require('joi');
const { objectId } = require('./custom.validation');

const variantSchema = Joi.object({
    size: Joi.string()
        .valid('XS', 'S', 'M', 'L', 'XL', 'XXL')
        .required()
        .messages({
            'string.base': 'Size phải là chuỗi',
            'any.only': 'Size không hợp lệ',
            'any.required': 'Size là bắt buộc'
        }),

    color: Joi.string().required().messages({
        'string.base': 'Màu sắc phải là chuỗi',
        'string.empty': 'Màu sắc không được để trống',
        'any.required': 'Màu sắc là bắt buộc'
    }),
});

const orderDetailSchema = Joi.object({
    productId: Joi.string().custom(objectId).required().messages({
        'string.base': 'ID sản phẩm phải là chuỗi',
        'any.required': 'ID sản phẩm là bắt buộc',
        'string.custom': 'ID sản phẩm không hợp lệ'
    }),

    quantity: Joi.number().integer().min(1).required().messages({
        'number.base': 'Số lượng phải là số',
        'number.integer': 'Số lượng phải là số nguyên',
        'number.min': 'Số lượng phải lớn hơn hoặc bằng 1',
        'any.required': 'Số lượng là bắt buộc'
    }),

    variant: Joi.array()
        .items(variantSchema)
        .max(1)
        .messages({
            'array.base': 'Variant phải là mảng',
            'array.max': 'Chỉ được chọn tối đa 1 variant'
        }),
});

const createOrder = {
    body: Joi.object({
        shippingAddress: Joi.object({
            fullName: Joi.string().required().messages({
                'string.base': 'Họ và tên phải là chuỗi',
                'string.empty': 'Họ và tên không được để trống',
                'any.required': 'Họ và tên là bắt buộc'
            }),

            phone: Joi.string()
                .pattern(/^[0-9]{10,11}$/)
                .required()
                .messages({
                    'string.base': 'Số điện thoại phải là chuỗi',
                    'string.pattern.base': 'Số điện thoại không hợp lệ',
                    'any.required': 'Số điện thoại là bắt buộc'
                }),

            address: Joi.string().required().messages({
                'string.base': 'Địa chỉ phải là chuỗi',
                'string.empty': 'Địa chỉ không được để trống',
                'any.required': 'Địa chỉ là bắt buộc'
            }),

            district: Joi.string().required().messages({
                'string.base': 'Quận/Huyện phải là chuỗi',
                'string.empty': 'Quận/Huyện không được để trống',
                'any.required': 'Quận/Huyện là bắt buộc'
            }),

            ward: Joi.string().required().messages({
                'string.base': 'Phường/Xã phải là chuỗi',
                'string.empty': 'Phường/Xã không được để trống',
                'any.required': 'Phường/Xã là bắt buộc'
            }),

            city: Joi.string().required().messages({
                'string.base': 'Thành phố phải là chuỗi',
                'string.empty': 'Thành phố không được để trống',
                'any.required': 'Thành phố là bắt buộc'
            }),

            country: Joi.string().default('Vietnam').messages({
                'string.base': 'Quốc gia phải là chuỗi'
            }),
        }).required().messages({
            'any.required': 'Địa chỉ giao hàng là bắt buộc'
        }),

        paymentMethod: Joi.string()
            .valid('COD', 'VNPay')
            .default('COD')
            .messages({
                'string.base': 'Phương thức thanh toán phải là chuỗi',
                'any.only': 'Phương thức thanh toán không hợp lệ'
            }),

        shippingFee: Joi.number().min(0).default(0).messages({
            'number.base': 'Phí vận chuyển phải là số',
            'number.min': 'Phí vận chuyển không được nhỏ hơn 0'
        }),

        couponId: Joi.string().custom(objectId).allow(null).optional().messages({
            'string.base': 'Coupon ID phải là chuỗi',
            'string.custom': 'Coupon ID không hợp lệ'
        }),

        discount: Joi.number().min(0).allow(null).optional().messages({
            'number.base': 'Giảm giá phải là số',
            'number.min': 'Giảm giá không được nhỏ hơn 0'
        }),

        notes: Joi.string().allow('').messages({
            'string.base': 'Ghi chú phải là chuỗi'
        }),

        orderDetails: Joi.array()
            .items(orderDetailSchema)
            .min(1)
            .required()
            .messages({
                'array.base': 'Danh sách sản phẩm phải là mảng',
                'array.min': 'Đơn hàng phải có ít nhất 1 sản phẩm',
                'any.required': 'Danh sách sản phẩm là bắt buộc'
            }),
    }),
};

const getOrders = {
    query: Joi.object({
        paymentMethod: Joi.string().valid('COD', 'VNPay').messages({
            'any.only': 'Phương thức thanh toán không hợp lệ'
        }),

        paymentStatus: Joi.string().valid('pending', 'paid', 'failed').messages({
            'any.only': 'Trạng thái thanh toán không hợp lệ'
        }),

        orderStatus: Joi.string()
            .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
            .messages({
                'any.only': 'Trạng thái đơn hàng không hợp lệ'
            }),

        userId: Joi.string().custom(objectId).messages({
            'string.custom': 'User ID không hợp lệ'
        }),

        sortBy: Joi.string(),
        limit: Joi.number().integer().min(1).max(100),
        page: Joi.number().integer().min(1),
        populate: Joi.string(),
    }),
};

const getOrder = {
    params: Joi.object({
        orderId: Joi.string().custom(objectId).required().messages({
            'any.required': 'Order ID là bắt buộc',
            'string.custom': 'Order ID không hợp lệ'
        }),
    }),
};

const updateOrderStatus = {
    params: Joi.object({
        orderId: Joi.string().custom(objectId).required().messages({
            'any.required': 'Order ID là bắt buộc',
            'string.custom': 'Order ID không hợp lệ'
        }),
    }),
    body: Joi.object({
        orderStatus: Joi.string()
            .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
            .messages({
                'any.only': 'Trạng thái đơn hàng không hợp lệ'
            }),

        paymentStatus: Joi.string()
            .valid('pending', 'paid', 'failed')
            .messages({
                'any.only': 'Trạng thái thanh toán không hợp lệ'
            }),

        notes: Joi.string().allow('').messages({
            'string.base': 'Ghi chú phải là chuỗi'
        }),
    })
        .min(1)
        .messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        }),
};

const cancelOrder = {
    params: Joi.object({
        orderId: Joi.string().custom(objectId).required().messages({
            'any.required': 'Order ID là bắt buộc',
            'string.custom': 'Order ID không hợp lệ'
        }),
    }),
    body: Joi.object({
        reason: Joi.string().max(500).required().messages({
            'string.base': 'Lý do hủy phải là chuỗi',
            'string.empty': 'Lý do hủy không được để trống',
            'string.max': 'Lý do hủy không được quá 500 ký tự',
            'any.required': 'Lý do hủy là bắt buộc'
        }),
    }),
};

const getUserOrders = {
    query: Joi.object({
        status: Joi.string()
            .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
            .messages({
                'any.only': 'Trạng thái đơn hàng không hợp lệ'
            }),

        sortBy: Joi.string().default('-createdAt'),
        limit: Joi.number().integer().min(1).max(100).default(20),
        page: Joi.number().integer().min(1).default(1),
    }),
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    cancelOrder,
    getUserOrders,
};
