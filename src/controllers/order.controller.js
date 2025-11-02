const catchAsync = require('../utils/catchAsync');
const orderService = require('../services/order.service');
const pick = require('../utils/pick');

const createOrder = catchAsync(async (req, res) => {
    req.body.userId = req.user.id
    const order = await orderService.createOrder(req.body);
    res.status(201).send(order);
});

const getOrders = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['paymentMethod', 'paymentStatus', 'orderStatus', 'userId']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const orders = await orderService.getOrders(filter, options);
    res.send(orders);
});

const getOrder = catchAsync(async (req, res) => {
    const order = await orderService.getOrderById(req.params.orderId);
    res.send(order);
});

const getOrderOfUser = catchAsync(async (req, res) => {
    const orders = await orderService.getOderOfUser(req.user.id)
    if (orders.length <= 0) {
        return res.json({
            message: "Bạn chưa có đơn hàng nào"
        })
    }
    res.send(orders)
})

const updateOrderStatus = catchAsync(async (req, res) => {
    const updated = await orderService.updateOrderStatus(req.params.orderId, req.body);
    res.send(updated);
});

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    getOrderOfUser
};

