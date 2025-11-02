const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCategory = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
    })
}

const getCategories = {
    query: Joi.object().keys({
        name: Joi.string().trim(),
        sortBy: Joi.string().trim(),
        limit: Joi.number().integer().min(1),
        page: Joi.number().integer().min(1)
    })
}

const getCategory = {
    params: Joi.object().keys({
        categoryId: Joi.string().custom(objectId).required()
    })
}

const updateCategory = {
    params: Joi.object().keys({
        categoryId: Joi.string().custom(objectId).required()
    }),
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
    }).min(1)
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory
}