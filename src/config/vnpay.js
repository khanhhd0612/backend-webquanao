const { VNPay, ignoreLogger } = require('vnpay');

const vnpay = new VNPay({
    tmnCode: 'SSKYFKXP',
    secureSecret: 'ZWASLUNEUY30DX0A5O1K1VIMLQU95EQD',
    vnpayHost: 'https://sandbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: 'SHA512',
    loggerFn: ignoreLogger
})

module.exports = vnpay