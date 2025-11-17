const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const cartItemSchema = new mongoose.Schema(
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
            default: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        variant: {
            size: {
                type: String,
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            },
            color: {
                type: String,
            },
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
    }
);

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
        totalAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalItems: {
            type: Number,
            default: 0,
            min: 0,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
            index: { expires: 0 },
        },
    },
    {
        timestamps: true,
    }
);

cartSchema.plugin(toJSON);

cartSchema.pre('save', function (next) {
    if (this.items && this.items.length > 0) {
        this.totalAmount = this.items.reduce((sum, item) => sum + item.subtotal, 0);
        this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
    } else {
        this.totalAmount = 0;
        this.totalItems = 0;
    }
    next();
});

// check product variant tồn tại trong cart
cartSchema.methods.findItemIndex = function (productId, variant) {
    return this.items.findIndex((item) => {
        if (!item.productId || !productId) {
            return false;
        }
        const productMatch = item.productId.toString() === productId.toString();

        if (!variant || !variant.size || !variant.color) {
            return productMatch && (!item.variant || !item.variant.size);
        }

        return (
            productMatch &&
            item.variant &&
            item.variant.size === variant.size &&
            item.variant.color === variant.color
        );
    });
};

cartSchema.statics.cleanExpiredCarts = async function () {
    const result = await this.deleteMany({
        expiresAt: { $lt: new Date() },
    });
    return result;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;