const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAddress = {
    body: Joi.object().keys({
        fullName: Joi.string().required().max(100),
        phone: Joi.string().required().pattern(/^[0-9]{10,11}$/),
        address: Joi.string().required().max(200),
        city: Joi.string().required(),
        district: Joi.string().optional(),
        ward: Joi.string().optional(),
        country: Joi.string().optional().default('Vietnam'),
        isDefault: Joi.boolean().optional()
    })
};

const getAddress = {
    params: Joi.object().keys({
        addressId: Joi.string().custom(objectId).required()
    })
};

const updateAddress = {
    params: Joi.object().keys({
        addressId: Joi.string().custom(objectId).required()
    }),
    body: Joi.object().keys({
        fullName: Joi.string().max(100),
        phone: Joi.string().pattern(/^[0-9]{10,11}$/),
        address: Joi.string().max(200),
        city: Joi.string(),
        district: Joi.string(),
        ward: Joi.string(),
        country: Joi.string(),
        isDefault: Joi.boolean()
    }).min(1)
};

const deleteAddress = {
    params: Joi.object().keys({
        addressId: Joi.string().custom(objectId).required()
    })
};

const setDefaultAddress = {
    params: Joi.object().keys({
        addressId: Joi.string().custom(objectId).required()
    })
};

module.exports = {
    createAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};