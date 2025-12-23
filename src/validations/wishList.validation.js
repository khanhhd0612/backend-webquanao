const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addToWishList = {
    body: Joi.object().keys({
        productId: Joi.string().custom(objectId).required().messages({
            'string.base': 'ID sản phẩm phải là chuỗi',
            'string.empty': 'ID sản phẩm không được để trống',
            'any.required': 'ID sản phẩm là bắt buộc',
            'string.custom': 'ID sản phẩm không hợp lệ'
        }),
    }),
};

module.exports = {
    addToWishList
};
