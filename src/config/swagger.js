const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API Documentation',
            version: '1.0.0',
            description: `API Documentation for E-Commerce Backend System`,
            contact: {
                name: 'API Support',
                email: 'khanhhd8880@gmail.com'
            },
        },
        servers: [
            {
                url: 'http://localhost:4000/v1',
                description: 'Development server'
            },
            {
                url: 'https://api.yoursite.com/v1',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token from login (without "Bearer " prefix)'
                }
            }
        },
        tags: [
            {
                name: 'Auth',
                description: 'Các endpoint xác thực người dùng'
            },
            {
                name: 'Users',
                description: 'Quản lý người dùng (Admin)'
            },
            {
                name: 'Categories',
                description: 'Quản lý danh mục sản phẩm'
            },
            {
                name: 'Products',
                description: 'Quản lý sản phẩm'
            },
            {
                name: 'Cart',
                description: 'Quản lý giỏ hàng'
            },
            {
                name: 'Orders',
                description: 'Quản lý đơn hàng'
            },
            {
                name: 'Reviews',
                description: 'Đánh giá sản phẩm'
            },
            {
                name: 'WishList',
                description: 'Danh sách yêu thích'
            },
            {
                name: 'Payment',
                description: 'Thanh toán VNPay'
            }
        ]
    },
    apis: [
        path.join(__dirname, '../routes/v1/*.js'),
        path.join(__dirname, '../docs/swagger/*.yaml')
    ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    swaggerSpec
};