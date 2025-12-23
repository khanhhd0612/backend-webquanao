const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAddress = {
    body: Joi.object({
        fullName: Joi.string().max(100).required().messages({
            'string.base': 'Họ và tên phải là chuỗi',
            'string.empty': 'Họ và tên không được để trống',
            'string.max': 'Họ và tên không được vượt quá 100 ký tự',
            'any.required': 'Họ và tên là bắt buộc'
        }),

        phone: Joi.string().pattern(/^[0-9]{10,11}$/).required().messages({
            'string.base': 'Số điện thoại phải là chuỗi',
            'string.empty': 'Số điện thoại không được để trống',
            'string.pattern.base': 'Số điện thoại phải gồm 10–11 chữ số',
            'any.required': 'Số điện thoại là bắt buộc'
        }),

        address: Joi.string().max(200).required().messages({
            'string.base': 'Địa chỉ phải là chuỗi',
            'string.empty': 'Địa chỉ không được để trống',
            'string.max': 'Địa chỉ không được vượt quá 200 ký tự',
            'any.required': 'Địa chỉ là bắt buộc'
        }),

        city: Joi.string().required().messages({
            'string.base': 'Tỉnh/Thành phố phải là chuỗi',
            'string.empty': 'Tỉnh/Thành phố không được để trống',
            'any.required': 'Tỉnh/Thành phố là bắt buộc'
        }),

        district: Joi.string().optional().messages({
            'string.base': 'Quận/Huyện phải là chuỗi'
        }),

        ward: Joi.string().optional().messages({
            'string.base': 'Phường/Xã phải là chuỗi'
        }),

        country: Joi.string().optional().default('Vietnam').messages({
            'string.base': 'Quốc gia phải là chuỗi'
        }),

        isDefault: Joi.boolean().optional().messages({
            'boolean.base': 'isDefault phải là kiểu boolean'
        })
    })
};

const getAddress = {
    params: Joi.object({
        addressId: Joi.string().custom(objectId).required().messages({
            'any.required': 'ID địa chỉ là bắt buộc',
            'string.empty': 'ID địa chỉ không được để trống',
            'string.custom': 'ID địa chỉ không hợp lệ'
        })
    })
};

const updateAddress = {
    params: Joi.object({
        addressId: Joi.string().custom(objectId).required().messages({
            'any.required': 'ID địa chỉ là bắt buộc',
            'string.custom': 'ID địa chỉ không hợp lệ'
        })
    }),
    body: Joi.object({
        fullName: Joi.string().max(100).messages({
            'string.base': 'Họ và tên phải là chuỗi',
            'string.max': 'Họ và tên không được vượt quá 100 ký tự'
        }),

        phone: Joi.string().pattern(/^[0-9]{10,11}$/).messages({
            'string.pattern.base': 'Số điện thoại phải gồm 10–11 chữ số'
        }),

        address: Joi.string().max(200).messages({
            'string.max': 'Địa chỉ không được vượt quá 200 ký tự'
        }),

        city: Joi.string().messages({
            'string.base': 'Tỉnh/Thành phố phải là chuỗi'
        }),

        district: Joi.string().messages({
            'string.base': 'Quận/Huyện phải là chuỗi'
        }),

        ward: Joi.string().messages({
            'string.base': 'Phường/Xã phải là chuỗi'
        }),

        country: Joi.string().messages({
            'string.base': 'Quốc gia phải là chuỗi'
        }),

        isDefault: Joi.boolean().messages({
            'boolean.base': 'isDefault phải là kiểu boolean'
        })
    }).min(1).messages({
        'object.min': 'Vui lòng cung cấp ít nhất một trường để cập nhật'
    })
};

const deleteAddress = {
    params: Joi.object({
        addressId: Joi.string().custom(objectId).required().messages({
            'any.required': 'ID địa chỉ là bắt buộc',
            'string.custom': 'ID địa chỉ không hợp lệ'
        })
    })
};

const setDefaultAddress = {
    params: Joi.object({
        addressId: Joi.string().custom(objectId).required().messages({
            'any.required': 'ID địa chỉ là bắt buộc',
            'string.custom': 'ID địa chỉ không hợp lệ'
        })
    })
};

module.exports = {
    createAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};
