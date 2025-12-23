const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
    body: Joi.object().keys({
        email: Joi.string().email().required().messages({
            'string.base': 'Email phải là chuỗi',
            'string.empty': 'Email không được để trống',
            'string.email': 'Email không hợp lệ',
            'any.required': 'Email là bắt buộc'
        }),
        password: Joi.string().required().custom(password).messages({
            'string.base': 'Mật khẩu phải là chuỗi',
            'string.empty': 'Mật khẩu không được để trống',
            'any.required': 'Mật khẩu là bắt buộc'
        }),
        name: Joi.string().required().messages({
            'string.base': 'Tên phải là chuỗi',
            'string.empty': 'Tên không được để trống',
            'any.required': 'Tên là bắt buộc'
        }),
        role: Joi.string().required().valid('user', 'admin').messages({
            'any.only': 'Vai trò phải là "user" hoặc "admin"',
            'string.empty': 'Vai trò không được để trống',
            'any.required': 'Vai trò là bắt buộc'
        }),
    }),
};

const updateRole = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required().messages({
            'any.required': 'ID người dùng là bắt buộc',
            'string.custom': 'ID người dùng không hợp lệ'
        }),
    }),
    body: Joi.object().keys({
        role: Joi.string().required().valid('user', 'admin').messages({
            'any.only': 'Vai trò phải là "user" hoặc "admin"',
            'string.empty': 'Vai trò không được để trống',
            'any.required': 'Vai trò là bắt buộc'
        }),
    }),
};

const getUsers = {
    query: Joi.object().keys({
        name: Joi.string().messages({
            'string.base': 'Tên phải là chuỗi'
        }),
        role: Joi.string().valid('user', 'admin').messages({
            'any.only': 'Vai trò phải là "user" hoặc "admin"'
        }),
        sortBy: Joi.string().messages({
            'string.base': 'sortBy phải là chuỗi'
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

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required().messages({
            'any.required': 'ID người dùng là bắt buộc',
            'string.custom': 'ID người dùng không hợp lệ'
        }),
    }),
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required().messages({
            'any.required': 'ID người dùng là bắt buộc',
            'string.custom': 'ID người dùng không hợp lệ'
        }),
    }),
    body: Joi.object()
        .keys({
            email: Joi.string().email().messages({
                'string.base': 'Email phải là chuỗi',
                'string.email': 'Email không hợp lệ'
            }),
            password: Joi.string().custom(password).messages({
                'string.base': 'Mật khẩu phải là chuỗi'
            }),
            name: Joi.string().messages({
                'string.base': 'Tên phải là chuỗi'
            }),
        })
        .min(1)
        .messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        }),
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId).required().messages({
            'any.required': 'ID người dùng là bắt buộc',
            'string.custom': 'ID người dùng không hợp lệ'
        }),
    }),
};

const updateProfile = {
    body: Joi.object().keys({
        name: Joi.string().messages({
            'string.base': 'Tên phải là chuỗi'
        }),
    })
        .min(1)
        .messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        }),
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    updateRole,
    updateProfile
};
