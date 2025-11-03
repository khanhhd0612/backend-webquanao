const { ProductCode, VnpLocale, dateFormat } = require('vnpay');
const catchAsync = require('../utils/catchAsync');
const vnpay = require('../config/vnpay');
const orderService = require('../services/order.service');
const ApiError = require('../utils/ApiError');

const payMent = catchAsync(async (req, res) => {
    const now = new Date();
    const expire = new Date(now.getTime() + 15 * 60 * 1000);

    const order = await orderService.getOrderById(req.body.orderId);

    if(order.paymentStatus == "paid"){
        throw new ApiError(404,'Đơn hàng đã được thanh toán')
    }

    const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: order.totalPrice,
        vnp_IpAddr: req.ip,
        vnp_TxnRef: Date.now().toString(),
        vnp_OrderInfo: req.body.orderId,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: 'http://localhost:4000/v1/vnpay/check-payment',
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(now),
        vnp_ExpireDate: dateFormat(expire)
    })

    return res.status(201).json(vnpayResponse);
})

const checkPayMent = catchAsync(async (req, res) => {
    const verified = vnpay.verifyReturnUrl(req.query);
    if (!verified.isVerified) {
        throw new ApiError(404, 'Thanh toán thất bại');
    }
    if (req.query.vnp_TransactionStatus !== "00") {
        throw new ApiError(404, 'Thanh toán thất bại');
    }
    await orderService.payMentByVnpay(req.query.vnp_OrderInfo);
    res.status(200).json({
        message: "Thanh toán thành công",
    })
})
module.exports = {
    payMent,
    checkPayMent
}