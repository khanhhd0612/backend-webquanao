const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const orderValidation = require('../../validations/order.validation');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router.post('/', auth(), validate(orderValidation.createOrder), orderController.createOrder);

router.get('/', auth('manageOrders'), validate(orderValidation.getOrders), orderController.getOrders);

router.get('/:orderId', auth('manageOrders'), validate(orderValidation.getOrder), orderController.getOrder);

router.get('/user/get', auth(), orderController.getOrderOfUser);

router.patch('/:orderId/status', auth('manageOrders'), orderController.updateOrderStatus);

module.exports = router;