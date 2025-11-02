const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
    body: Joi.object().keys({
        productId: Joi.string().custom(objectId).required(),
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().allow('').optional(),
    }),
};

const getReviews = {
    query: Joi.object().keys({
        productId: Joi.string().custom(objectId).required(),
        limit: Joi.number().integer().min(1),
        page: Joi.number().integer().min(1),
    }),
};

const updateReview = {
    params: Joi.object().keys({
        reviewId: Joi.string().custom(objectId).required(),
    }),
    body: Joi.object().keys({
        rating: Joi.number().min(1).max(5).optional(),
        comment: Joi.string().allow('').optional(),
    }),
};

const getReview = {
    params: Joi.object().keys({
        reviewId: Joi.string().custom(objectId).required(),
    }),
};

module.exports = {
    createReview,
    getReviews,
    updateReview,
    getReview,
};
