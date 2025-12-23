const Joi = require('joi');
const { objectId } = require('./custom.validation');

const variantSchema = Joi.object({
    size: Joi.string()
        .valid('XS', 'S', 'M', 'L', 'XL', 'XXL')
        .required()
        .messages({
            'string.base': 'Size phải là chuỗi',
            'any.only': 'Size không hợp lệ',
            'any.required': 'Size là bắt buộc'
        }),

    color: Joi.string().trim().required().messages({
        'string.base': 'Màu sắc phải là chuỗi',
        'string.empty': 'Màu sắc không được để trống',
        'any.required': 'Màu sắc là bắt buộc'
    }),

    stock: Joi.number().integer().min(0).required().messages({
        'number.base': 'Số lượng tồn kho phải là số',
        'number.integer': 'Số lượng tồn kho phải là số nguyên',
        'number.min': 'Số lượng tồn kho không được nhỏ hơn 0',
        'any.required': 'Số lượng tồn kho là bắt buộc'
    }),

    price: Joi.number().min(0).optional().messages({
        'number.base': 'Giá phải là số',
        'number.min': 'Giá không được nhỏ hơn 0'
    }),

    discountPrice: Joi.number().min(0).optional().messages({
        'number.base': 'Giá khuyến mãi phải là số',
        'number.min': 'Giá khuyến mãi không được nhỏ hơn 0'
    }),
});

const createProduct = {
    body: Joi.object().keys({
        name: Joi.string().trim().required().messages({
            'string.base': 'Tên sản phẩm phải là chuỗi',
            'string.empty': 'Tên sản phẩm không được để trống',
            'any.required': 'Tên sản phẩm là bắt buộc'
        }),

        description: Joi.string().allow('').optional().messages({
            'string.base': 'Mô tả phải là chuỗi'
        }),

        categoryId: Joi.string().custom(objectId).required().messages({
            'string.base': 'Category ID phải là chuỗi',
            'string.custom': 'Category ID không hợp lệ',
            'any.required': 'Danh mục sản phẩm là bắt buộc'
        }),

        basePrice: Joi.number().min(0).required().messages({
            'number.base': 'Giá gốc phải là số',
            'number.min': 'Giá gốc không được nhỏ hơn 0',
            'any.required': 'Giá gốc là bắt buộc'
        }),

        baseDiscountPrice: Joi.number().min(0).optional().messages({
            'number.base': 'Giá khuyến mãi phải là số',
            'number.min': 'Giá khuyến mãi không được nhỏ hơn 0'
        }),

        images: Joi.alternatives()
            .try(
                Joi.array().items(Joi.string().uri()),
                Joi.array().items(Joi.string())
            )
            .default([])
            .messages({
                'alternatives.match': 'Danh sách ảnh không hợp lệ',
                'array.base': 'Images phải là mảng'
            }),

        variants: Joi.array().items(variantSchema).optional().messages({
            'array.base': 'Variants phải là mảng'
        }),

        rating: Joi.number().min(0).max(5).optional().messages({
            'number.base': 'Đánh giá phải là số',
            'number.min': 'Đánh giá không được nhỏ hơn 0',
            'number.max': 'Đánh giá không được lớn hơn 5'
        }),

        numReviews: Joi.number().integer().min(0).optional().messages({
            'number.base': 'Số lượt đánh giá phải là số',
            'number.integer': 'Số lượt đánh giá phải là số nguyên',
            'number.min': 'Số lượt đánh giá không được nhỏ hơn 0'
        }),

        isActive: Joi.boolean().default(true).messages({
            'boolean.base': 'Trạng thái hoạt động phải là true hoặc false'
        }),
    }),
};

const updateProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(objectId).required().messages({
            'any.required': 'Product ID là bắt buộc',
            'string.custom': 'Product ID không hợp lệ'
        }),
    }),

    body: Joi.object()
        .keys({
            name: Joi.string().trim().optional().messages({
                'string.base': 'Tên sản phẩm phải là chuỗi'
            }),

            description: Joi.string().allow('').optional().messages({
                'string.base': 'Mô tả phải là chuỗi'
            }),

            categoryId: Joi.string().custom(objectId).optional().messages({
                'string.custom': 'Category ID không hợp lệ'
            }),

            basePrice: Joi.number().min(0).optional().messages({
                'number.base': 'Giá gốc phải là số',
                'number.min': 'Giá gốc không được nhỏ hơn 0'
            }),

            baseDiscountPrice: Joi.number().min(0).optional().messages({
                'number.base': 'Giá khuyến mãi phải là số',
                'number.min': 'Giá khuyến mãi không được nhỏ hơn 0'
            }),

            images: Joi.alternatives()
                .try(
                    Joi.array().items(Joi.string().uri()),
                    Joi.array().items(Joi.string())
                )
                .optional()
                .messages({
                    'alternatives.match': 'Danh sách ảnh không hợp lệ'
                }),

            variants: Joi.array().items(variantSchema).optional().messages({
                'array.base': 'Variants phải là mảng'
            }),

            rating: Joi.number().min(0).max(5).optional().messages({
                'number.min': 'Đánh giá không được nhỏ hơn 0',
                'number.max': 'Đánh giá không được lớn hơn 5'
            }),

            numReviews: Joi.number().integer().min(0).optional().messages({
                'number.integer': 'Số lượt đánh giá phải là số nguyên'
            }),

            isActive: Joi.boolean().optional().messages({
                'boolean.base': 'Trạng thái hoạt động phải là true hoặc false'
            }),
        })
        .min(1)
        .messages({
            'object.min': 'Phải có ít nhất một trường để cập nhật'
        }),
};

const getProducts = {
    query: Joi.object().keys({
        name: Joi.string().messages({
            'string.base': 'Tên sản phẩm phải là chuỗi'
        }),

        categoryId: Joi.string().custom(objectId).messages({
            'string.custom': 'Category ID không hợp lệ'
        }),

        sortBy: Joi.string(),
        limit: Joi.number().integer().min(1).messages({
            'number.integer': 'Limit phải là số nguyên',
            'number.min': 'Limit phải lớn hơn 0'
        }),

        page: Joi.number().integer().min(1).messages({
            'number.integer': 'Page phải là số nguyên',
            'number.min': 'Page phải lớn hơn 0'
        }),
    }),
};

const getProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(objectId).required().messages({
            'any.required': 'Product ID là bắt buộc',
            'string.custom': 'Product ID không hợp lệ'
        }),
    }),
};

const deleteProduct = {
    params: Joi.object().keys({
        productId: Joi.string().custom(objectId).required().messages({
            'any.required': 'Product ID là bắt buộc',
            'string.custom': 'Product ID không hợp lệ'
        }),
    }),
};

module.exports = {
    createProduct,
    updateProduct,
    getProducts,
    getProduct,
    deleteProduct,
};
