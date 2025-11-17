const Joi = require('joi');
const { objectId } = require('./custom.validation');

const variantSchema = Joi.object({
    size: Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL').required(),
    color: Joi.string().required(),
});

const orderDetailSchema = Joi.object({
    productId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().integer().min(1).required(),
    variant: Joi.array().items(variantSchema).max(1), // Array với tối đa 1 phần tử
});

const createOrder = {
    body: Joi.object({
        shippingAddress: Joi.object({
            fullName: Joi.string().required(),
            phone: Joi.string()
                .pattern(/^[0-9]{10,11}$/)
                .required()
                .messages({
                    'string.pattern.base': 'Số điện thoại không hợp lệ'
                }),
            address: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().default('Vietnam'),
        }).required(),
        paymentMethod: Joi.string().valid('COD', 'VNPay').default('COD'),
        shippingFee: Joi.number().min(0).default(0),
        notes: Joi.string().allow(''),
        orderDetails: Joi.array()
            .items(orderDetailSchema)
            .min(1)
            .required()
            .messages({
                'array.min': 'Đơn hàng phải có ít nhất 1 sản phẩm'
            }),
    }),
};

const getOrders = {
    query: Joi.object({
        paymentMethod: Joi.string().valid('COD', 'VNPay'),
        paymentStatus: Joi.string().valid('pending', 'paid', 'failed'),
        orderStatus: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
        userId: Joi.string().custom(objectId),
        sortBy: Joi.string(),
        limit: Joi.number().integer().min(1).max(100),
        page: Joi.number().integer().min(1),
        populate: Joi.string(),
    }),
};

const getOrder = {
    params: Joi.object({
        orderId: Joi.string().custom(objectId).required(),
    }),
};

const updateOrderStatus = {
    params: Joi.object({
        orderId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object({
        orderStatus: Joi.string()
            .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
        paymentStatus: Joi.string()
            .valid('pending', 'paid', 'failed'),
        notes: Joi.string().allow(''),
    })
        .min(1)
        .messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        }),
};

const cancelOrder = {
    params: Joi.object({
        orderId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object({
        reason: Joi.string().max(500).required().messages({
            'string.max': 'Lý do hủy không được quá 500 ký tự'
        }),
    }),
};

const getUserOrders = {
    query: Joi.object({
        status: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
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