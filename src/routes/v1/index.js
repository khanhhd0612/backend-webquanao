const express = require('express');
const authRoute = require('./auth.route');
const categoryRoute = require('./category.route');
const productRoute = require('./product.route');
const userRoute = require('./user.route');
const reviewRoute = require('./review.route');
const orderRoute = require('./order.route');
const cartRoute = require('./cart.route');
const wishListRoute = require('./wishList.route');
const vnpayRoute = require('./vnpay.route');
const searchRoute = require('./search.route');
const couponRoute = require('./coupon.route');
const addressRoute = require('./address.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/category',
        route: categoryRoute,
    },
    {
        path: '/search',
        route: searchRoute,
    },
    {
        path: '/user',
        route: userRoute,
    },
    {
        path: '/product',
        route: productRoute,
    },
    {
        path: '/review',
        route: reviewRoute,
    },
    {
        path: '/order',
        route: orderRoute,
    },
    {
        path: '/cart',
        route: cartRoute,
    },
    {
        path: '/wish-list',
        route: wishListRoute,
    },
    {
        path: '/vnpay',
        route: vnpayRoute,
    },
    {
        path: '/coupon',
        route: couponRoute,
    },
    {
        path: '/addresses',
        route: addressRoute
    },

];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
