const Joi = require('joi');
const { objectId } = require('./custom.validation');

const variantSchema = Joi.object({
    size: Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL').required(),
    color: Joi.string().trim().required(),
    stock: Joi.number().integer().min(0).required(),
    price: Joi.number().min(0).optional(),
    discountPrice: Joi.number().min(0).optional(),
});

const createProduct = {
    body: Joi.object().keys({
        name: Joi.string().trim().required(),
        description: Joi.string().allow('').optional(),
        categoryId: Joi.string().custom(objectId).required(),
        basePrice: Joi.number().min(0).required(),
        baseDiscountPrice: Joi.number().min(0).optional(),
        images: Joi.alternatives().try(
            Joi.array().items(Joi.string().uri()),
            Joi.array().items(Joi.string())
        ).default([]),
        variants: Joi.array().items(variantSchema).optional(),
        rating: Joi.number().min(0).max(5).optional(),
        numReviews: Joi.number().integer().min(0).optional(),
        isActive: Joi.boolean().default(true),
    }),
};

const updateProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string().trim().optional(),
            description: Joi.string().allow('').optional(),
            categoryId: Joi.string().custom(objectId).optional(),
            basePrice: Joi.number().min(0).optional(),
            baseDiscountPrice: Joi.number().min(0).optional(),
            images: Joi.alternatives().try(
                Joi.array().items(Joi.string().uri()),
                Joi.array().items(Joi.string())
            ).default([]),
            variants: Joi.array().items(variantSchema).optional(),
            rating: Joi.number().min(0).max(5).optional(),
            numReviews: Joi.number().integer().min(0).optional(),
            isActive: Joi.boolean().optional(),
        })
        .min(1),
};

const getProducts = {
    query: Joi.object().keys({
        name: Joi.string(),
        categoryId: Joi.string().custom(objectId),
        sortBy: Joi.string(),
        limit: Joi.number().integer().min(1),
        page: Joi.number().integer().min(1),
    }),
};

const getProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(objectId).required(),
    }),
};

const deleteProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(objectId).required(),
    }),
};

module.exports = {
    createProduct,
    updateProduct,
    getProducts,
    getProduct,
    deleteProduct,
};
