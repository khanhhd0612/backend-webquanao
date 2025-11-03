const Joi = require('joi');
const { objectId } = require('./custom.validation');

const orderDetailSchema = Joi.object({
    productId: Joi.string().custom(objectId).required(),
    quantity: Joi.number().integer().min(1).required(),
    variant: Joi.object({
        size: Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL'),
        color: Joi.string(),
    }).optional(),
});

const createOrder = {
    body: Joi.object().keys({
        shippingAddress: Joi.object({
            fullName: Joi.string().required(),
            phone: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().default('Vietnam'),
        }).required(),
        paymentMethod: Joi.string().valid('COD', 'PayPal', 'VNPay', 'CreditCard').default('COD'),
        paymentStatus: Joi.string().valid('pending', 'paid', 'failed').default('pending'),
        orderStatus: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled').default('pending'),
        shippingFee: Joi.number().default(0),
        totalPrice: Joi.number().default(0),
        notes: Joi.string().allow('', null),
        orderDetails: Joi.array().items(orderDetailSchema).required(),
    }),
};

const updateOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object()
        .keys({
            shippingAddress: Joi.object({
                fullName: Joi.string(),
                phone: Joi.string(),
                address: Joi.string(),
                city: Joi.string(),
                country: Joi.string(),
            }),
            paymentMethod: Joi.string().valid('COD', 'PayPal', 'VNPay', 'CreditCard'),
            paymentStatus: Joi.string().valid('pending', 'paid', 'failed'),
            orderStatus: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
            shippingFee: Joi.number(),
            totalPrice: Joi.number(),
            notes: Joi.string().allow('', null),
            orderDetails: Joi.array().items(orderDetailSchema),
        })
        .min(1),
};

const getOrders = {
    query: Joi.object().keys({
        userId: Joi.string().custom(objectId),
        orderStatus: Joi.string().valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    }),
};

const getOrder = {
    params: Joi.object().keys({
        orderId: Joi.string().custom(objectId),
    }),
};

const payment = {
    body: Joi.object().keys({
        orderId: Joi.string().custom(objectId),
    }),
}

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    payment
};
