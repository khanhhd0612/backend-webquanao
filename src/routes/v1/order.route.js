const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router.post('/', auth(), validate(orderValidation.createOrder), orderController.createOrder);

router.get('/user/get', auth(), orderController.getOrderOfUser);

router.get('/user/orders', auth(), orderController.getUserOrders);

router.get('/user/statistics', auth(), orderController.getUserOrderStatistics);

router.post('/:orderId/cancel', auth(), validate(orderValidation.cancelOrder), orderController.cancelOrder);

router.post('/:orderId/payment/vnpay', auth(), orderController.confirmVnpayPayment);

//admin 
router.get('/', auth('manageOrders'), validate(orderValidation.getOrders), orderController.getOrders);

router.patch('/:orderId/status', auth('manageOrders'), validate(orderValidation.updateOrderStatus), orderController.updateOrderStatus);

// chủ đơn hàng hoặc admin
router.get('/:orderId', auth(), validate(orderValidation.getOrder), orderController.getOrder);

module.exports = router;