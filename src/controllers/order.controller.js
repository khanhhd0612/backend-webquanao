const catchAsync = require('../utils/catchAsync');
const orderService = require('../services/order.service');
const couponUsageService = require('../services/couponUsage.service');
const cartService = require('../services/cart.service');
const pick = require('../utils/pick');

const createOrder = catchAsync(async (req, res) => {
    req.body.userId = req.user.id;
    const order = await orderService.createOrder(req.body);
    if (req.body.couponId) {
        await couponUsageService.checkOutWithCoupon(req.body.userId, order.id, req.body.couponId, req.body.discount)
    }
    await cartService.clearCart(req.user.id)
    res.status(201).send(order);
});

const getOrders = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['paymentMethod', 'paymentStatus', 'orderStatus', 'userId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);

    const orders = await orderService.getOrders(filter, options);
    res.send(orders);
});

const getOrder = catchAsync(async (req, res) => {
    const order = await orderService.getOrderById(req.params.orderId);

    // Kiểm tra quyền truy cập: Admin hoặc chủ đơn hàng
    if (!req.user.role || req.user.role !== 'admin') {
        if (order.userId._id.toString() !== req.user.id) {
            return res.status(403).send({
                message: 'Bạn không có quyền xem đơn hàng này'
            });
        }
    }

    res.send(order);
});

const getOrderOfUser = catchAsync(async (req, res) => {
    const orders = await orderService.getOrdersOfUser(req.user.id);

    if (orders.length <= 0) {
        return res.json({
            message: "Bạn chưa có đơn hàng nào",
            results: []
        });
    }

    res.send(orders);
});

const getUserOrders = catchAsync(async (req, res) => {
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    if (req.query.status) {
        options.status = req.query.status;
    }

    const result = await orderService.getOrdersOfUser(req.user.id, options);

    if (result.totalResults === 0) {
        return res.json({
            message: "Bạn chưa có đơn hàng nào",
            ...result
        });
    }

    res.send(result);
});

const updateOrderStatus = catchAsync(async (req, res) => {
    const updated = await orderService.updateOrderStatus(req.params.orderId, req.body);
    res.send(updated);
});

const cancelOrder = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const { reason } = req.body;

    // User chỉ có thể hủy đơn của mình, Admin có thể hủy tất cả
    const userId = req.user.role === 'admin' ? null : req.user.id;

    const order = await orderService.cancelOrder(orderId, userId, reason);

    res.send({
        message: 'Đơn hàng đã được hủy thành công',
        order
    });
});

const confirmVnpayPayment = catchAsync(async (req, res) => {
    const { orderId } = req.params;
    const order = await orderService.paymentByVnpay(orderId);

    res.send({
        message: 'Thanh toán VNPay thành công',
        order
    });
});

const getUserOrderStatistics = catchAsync(async (req, res) => {
    const userId = req.user.id;

    const [total, pending, confirmed, shipped, delivered, cancelled] = await Promise.all([
        orderService.getOrders({ userId }, { limit: 0, page: 1 }),
        orderService.getOrders({ userId, orderStatus: 'pending' }, { limit: 0, page: 1 }),
        orderService.getOrders({ userId, orderStatus: 'confirmed' }, { limit: 0, page: 1 }),
        orderService.getOrders({ userId, orderStatus: 'shipped' }, { limit: 0, page: 1 }),
        orderService.getOrders({ userId, orderStatus: 'delivered' }, { limit: 0, page: 1 }),
        orderService.getOrders({ userId, orderStatus: 'cancelled' }, { limit: 0, page: 1 }),
    ]);

    res.send({
        total: total.totalResults,
        pending: pending.totalResults,
        confirmed: confirmed.totalResults,
        shipped: shipped.totalResults,
        delivered: delivered.totalResults,
        cancelled: cancelled.totalResults,
    });
});

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    getOrderOfUser,
    getUserOrders,
    updateOrderStatus,
    cancelOrder,
    confirmVnpayPayment,
    getUserOrderStatistics,
};