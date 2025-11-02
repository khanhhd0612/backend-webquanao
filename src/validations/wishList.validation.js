const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addToWishList = {
    body: Joi.object().keys({
        productId: Joi.string().custom(objectId).required(),
    })
}

module.exports = {
    addToWishList
}