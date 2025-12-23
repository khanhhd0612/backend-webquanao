const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
    body: Joi.object().keys({
        productId: Joi.string().custom(objectId).required().messages({
            'string.base': 'ID sản phẩm phải là chuỗi',
            'string.empty': 'ID sản phẩm không được để trống',
            'any.required': 'ID sản phẩm là bắt buộc',
            'string.custom': 'ID sản phẩm không hợp lệ'
        }),

        rating: Joi.number().min(1).max(5).required().messages({
            'number.base': 'Số sao đánh giá phải là số',
            'number.min': 'Số sao đánh giá tối thiểu là 1',
            'number.max': 'Số sao đánh giá tối đa là 5',
            'any.required': 'Số sao đánh giá là bắt buộc'
        }),

        comment: Joi.string().allow('').optional().messages({
            'string.base': 'Nội dung đánh giá phải là chuỗi'
        }),
    }),
};

const getReviews = {
    query: Joi.object().keys({
        productId: Joi.string().custom(objectId).required().messages({
            'any.required': 'ID sản phẩm là bắt buộc',
            'string.custom': 'ID sản phẩm không hợp lệ'
        }),

        limit: Joi.number().integer().min(1).messages({
            'number.base': 'Limit phải là số',
            'number.integer': 'Limit phải là số nguyên',
            'number.min': 'Limit phải lớn hơn 0'
        }),

        page: Joi.number().integer().min(1).messages({
            'number.base': 'Page phải là số',
            'number.integer': 'Page phải là số nguyên',
            'number.min': 'Page phải lớn hơn 0'
        }),
    }),
};

const updateReview = {
    params: Joi.object().keys({
        reviewId: Joi.string().custom(objectId).required().messages({
            'any.required': 'Review ID là bắt buộc',
            'string.custom': 'Review ID không hợp lệ'
        }),
    }),

    body: Joi.object().keys({
        rating: Joi.number().min(1).max(5).optional().messages({
            'number.base': 'Số sao đánh giá phải là số',
            'number.min': 'Số sao đánh giá tối thiểu là 1',
            'number.max': 'Số sao đánh giá tối đa là 5'
        }),

        comment: Joi.string().allow('').optional().messages({
            'string.base': 'Nội dung đánh giá phải là chuỗi'
        }),
    })
        .min(1)
        .messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        }),
};

const getReview = {
    params: Joi.object().keys({
        reviewId: Joi.string().custom(objectId).required().messages({
            'any.required': 'Review ID là bắt buộc',
            'string.custom': 'Review ID không hợp lệ'
        }),
    }),
};

module.exports = {
    createReview,
    getReviews,
    updateReview,
    getReview,
};
