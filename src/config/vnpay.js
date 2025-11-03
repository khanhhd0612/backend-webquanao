const { VNPay, ignoreLogger } = require('vnpay');

const vnpay = new VNPay({
    tmnCode: process.env.TMN_CODE,
    secureSecret: process.env.SECURE_SECRET,
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: 'SHA512',
    loggerFn: ignoreLogger
})

module.exports = vnpay