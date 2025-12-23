const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCategory = {
    body: Joi.object().keys({
        name: Joi.string().max(100).required().messages({
            'string.base': 'Tên danh mục phải là chuỗi',
            'string.empty': 'Tên danh mục không được để trống',
            'string.max': 'Tên danh mục không được vượt quá 100 ký tự',
            'any.required': 'Tên danh mục là bắt buộc'
        }),

        description: Joi.string().max(500).required().messages({
            'string.base': 'Mô tả phải là chuỗi',
            'string.empty': 'Mô tả không được để trống',
            'string.max': 'Mô tả không được vượt quá 500 ký tự',
            'any.required': 'Mô tả là bắt buộc'
        }),

        image: Joi.string().uri().required().messages({
            'string.base': 'Ảnh phải là chuỗi',
            'string.empty': 'Ảnh không được để trống',
            'string.uri': 'Ảnh phải là URL hợp lệ',
            'any.required': 'Ảnh danh mục là bắt buộc'
        })
    })
};

const getCategories = {
    query: Joi.object().keys({
        name: Joi.string().trim().messages({
            'string.base': 'Tên danh mục phải là chuỗi'
        }),

        sortBy: Joi.string().trim().messages({
            'string.base': 'sortBy phải là chuỗi'
        }),

        limit: Joi.number().integer().min(1).messages({
            'number.base': 'limit phải là số',
            'number.integer': 'limit phải là số nguyên',
            'number.min': 'limit phải lớn hơn hoặc bằng 1'
        }),

        page: Joi.number().integer().min(1).messages({
            'number.base': 'page phải là số',
            'number.integer': 'page phải là số nguyên',
            'number.min': 'page phải lớn hơn hoặc bằng 1'
        })
    })
};

const getCategory = {
    params: Joi.object().keys({
        categoryId: Joi.string().custom(objectId).required().messages({
            'string.base': 'ID danh mục phải là chuỗi',
            'string.empty': 'ID danh mục không được để trống',
            'any.required': 'ID danh mục là bắt buộc',
            'string.custom': 'ID danh mục không hợp lệ'
        })
    })
};

const updateCategory = {
    params: Joi.object().keys({
        categoryId: Joi.string().custom(objectId).required().messages({
            'string.base': 'ID danh mục phải là chuỗi',
            'string.empty': 'ID danh mục không được để trống',
            'any.required': 'ID danh mục là bắt buộc',
            'string.custom': 'ID danh mục không hợp lệ'
        })
    }),
    body: Joi.object().keys({
        name: Joi.string().max(100).messages({
            'string.base': 'Tên danh mục phải là chuỗi',
            'string.empty': 'Tên danh mục không được để trống',
            'string.max': 'Tên danh mục không được vượt quá 100 ký tự'
        }),

        description: Joi.string().max(500).messages({
            'string.base': 'Mô tả phải là chuỗi',
            'string.empty': 'Mô tả không được để trống',
            'string.max': 'Mô tả không được vượt quá 500 ký tự'
        }),

        image: Joi.string().uri().messages({
            'string.base': 'Ảnh phải là chuỗi',
            'string.uri': 'Ảnh phải là URL hợp lệ'
        })
    }).min(1).messages({
        'object.min': 'Vui lòng cung cấp ít nhất một trường để cập nhật danh mục'
    })
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory
};
