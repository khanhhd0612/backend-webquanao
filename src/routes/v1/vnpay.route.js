const express = require('express');
const vnpayController = require('../../controllers/vnpay.controller');
const orderValidation = require('../../validations/order.validation');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth')


const router = express.Router();

router.post('/payment', auth(), validate(orderValidation.payment), vnpayController.payMent)

router.get('/check-payment',vnpayController.checkPayMent)

module.exports = router;