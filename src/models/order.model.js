const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const variantSchema = new mongoose.Schema(
    {
        size: {
            type: String,
            enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            required: true,
        },
        color: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false }
);

const orderDetailSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        variant: [variantSchema]
    }
);

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            country: { type: String, default: 'Vietnam' },
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'VNPay'],
            default: 'COD',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        shippingFee: {
            type: Number,
            default: 0,
        },
        totalPrice: {
            type: Number,
            default: 0,
        },
        notes: {
            type: String,
            trim: true,
        },
        orderDetails: [orderDetailSchema]
    },
    { timestamps: true }
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
