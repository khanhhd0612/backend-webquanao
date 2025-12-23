const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addToCart = {
    body: Joi.object().keys({
        productId: Joi.string().custom(objectId).required().messages({
            'string.base': 'ID sản phẩm phải là chuỗi',
            'string.empty': 'ID sản phẩm không được để trống',
            'any.required': 'ID sản phẩm là bắt buộc',
            'string.custom': 'ID sản phẩm không hợp lệ'
        }),

        quantity: Joi.number().integer().min(1).required().messages({
            'number.base': 'Số lượng phải là số',
            'number.integer': 'Số lượng phải là số nguyên',
            'number.min': 'Số lượng phải lớn hơn hoặc bằng 1',
            'any.required': 'Số lượng là bắt buộc'
        }),

        variant: Joi.object({
            size: Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL').messages({
                'string.base': 'Kích thước phải là chuỗi',
                'any.only': 'Kích thước chỉ được là XS, S, M, L, XL hoặc XXL'
            }),

            color: Joi.string().messages({
                'string.base': 'Màu sắc phải là chuỗi'
            })
        })
            .optional()
            .messages({
                'object.base': 'Variant phải là một object'
            })
    })
};

const updateCartItem = {
    params: Joi.object().keys({
        itemId: Joi.string().custom(objectId).required().messages({
            'string.base': 'ID sản phẩm trong giỏ hàng phải là chuỗi',
            'string.empty': 'ID sản phẩm trong giỏ hàng không được để trống',
            'any.required': 'ID sản phẩm trong giỏ hàng là bắt buộc',
            'string.custom': 'ID sản phẩm trong giỏ hàng không hợp lệ'
        })
    }),
    body: Joi.object().keys({
        quantity: Joi.number().integer().min(1).required().messages({
            'number.base': 'Số lượng phải là số',
            'number.integer': 'Số lượng phải là số nguyên',
            'number.min': 'Số lượng phải lớn hơn hoặc bằng 1',
            'any.required': 'Số lượng là bắt buộc'
        })
    })
};

const removeCartItem = {
    params: Joi.object().keys({
        itemId: Joi.string().custom(objectId).required().messages({
            'string.base': 'ID sản phẩm trong giỏ hàng phải là chuỗi',
            'string.empty': 'ID sản phẩm trong giỏ hàng không được để trống',
            'any.required': 'ID sản phẩm trong giỏ hàng là bắt buộc',
            'string.custom': 'ID sản phẩm trong giỏ hàng không hợp lệ'
        })
    })
};

module.exports = {
    addToCart,
    updateCartItem,
    removeCartItem
};
