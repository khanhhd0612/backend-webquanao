const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addToCart = {
    body: Joi.object().keys({
        productId: Joi.string().custom(objectId).required(),
        quantity: Joi.number().integer().min(1).required(),
        variant: Joi.object({
            size: Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL'),
            color: Joi.string(),
        }).optional(),
    }),
};

const updateCartItem = {
    params: Joi.object().keys({
        itemId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object().keys({
        quantity: Joi.number().integer().min(1).required(),
    }),
};

const removeCartItem = {
    params: Joi.object().keys({
        itemId: Joi.string().custom(objectId).required(),
    }),
};

module.exports = {
    addToCart,
    updateCartItem,
    removeCartItem,
};