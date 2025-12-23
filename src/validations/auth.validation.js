const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
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
    }),
};

const login = {
    body: Joi.object().keys({
        email: Joi.string().required().messages({
            'string.base': 'Email phải là chuỗi',
            'string.empty': 'Email không được để trống',
            'any.required': 'Email là bắt buộc'
        }),
        password: Joi.string().required().messages({
            'string.base': 'Mật khẩu phải là chuỗi',
            'string.empty': 'Mật khẩu không được để trống',
            'any.required': 'Mật khẩu là bắt buộc'
        }),
    }),
};

const logout = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required().messages({
            'string.base': 'Refresh token phải là chuỗi',
            'string.empty': 'Refresh token không được để trống',
            'any.required': 'Refresh token là bắt buộc'
        }),
    }),
};

const refreshTokens = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required().messages({
            'string.base': 'Refresh token phải là chuỗi',
            'string.empty': 'Refresh token không được để trống',
            'any.required': 'Refresh token là bắt buộc'
        }),
    }),
};

const forgotPassword = {
    body: Joi.object().keys({
        email: Joi.string().email().required().messages({
            'string.base': 'Email phải là chuỗi',
            'string.empty': 'Email không được để trống',
            'string.email': 'Email không hợp lệ',
            'any.required': 'Email là bắt buộc'
        }),
    }),
};

const changePassword = {
    body: Joi.object().keys({
        oldPassword: Joi.string().min(8).required().messages({
            'string.base': 'Mật khẩu cũ phải là chuỗi',
            'string.empty': 'Mật khẩu cũ không được để trống',
            'string.min': 'Mật khẩu cũ phải ít nhất 8 ký tự',
            'any.required': 'Mật khẩu cũ là bắt buộc'
        }),

        newPassword: Joi.string().min(8).required().messages({
            'string.base': 'Mật khẩu mới phải là chuỗi',
            'string.empty': 'Mật khẩu mới không được để trống',
            'string.min': 'Mật khẩu mới phải ít nhất 8 ký tự',
            'any.required': 'Mật khẩu mới là bắt buộc'
        }),
    }),
};

const resetPassword = {
    query: Joi.object().keys({
        token: Joi.string().required().messages({
            'string.base': 'Token phải là chuỗi',
            'string.empty': 'Token không được để trống',
            'any.required': 'Token là bắt buộc'
        }),
    }),
    body: Joi.object().keys({
        password: Joi.string().required().custom(password).messages({
            'string.base': 'Mật khẩu phải là chuỗi',
            'string.empty': 'Mật khẩu không được để trống',
            'any.required': 'Mật khẩu là bắt buộc'
        }),
    }),
};

const verifyEmail = {
    query: Joi.object().keys({
        token: Joi.string().required().messages({
            'string.base': 'Token phải là chuỗi',
            'string.empty': 'Token không được để trống',
            'any.required': 'Token là bắt buộc'
        }),
    }),
};

module.exports = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail,
    changePassword
};
