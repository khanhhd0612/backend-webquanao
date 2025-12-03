const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const productSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    addedAt: {
        type: Date,
        default: new Date(Date.now()),
    },
})
const wishListSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        products: [productSchema]
    },
    {
        timestamps: true,
    }
);

wishListSchema.plugin(toJSON);
wishListSchema.plugin(paginate);

wishListSchema.methods.findItemIndex = function (productId) {
    return this.products.findIndex((item) => {
        const id1 = item.productId._id ? item.productId._id.toString() : item.productId.toString();

        return id1 === productId.toString();
    });
};

const Review = mongoose.model('wish_list', wishListSchema);
module.exports = Review;
