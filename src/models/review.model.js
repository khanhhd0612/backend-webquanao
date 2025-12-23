const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const reviewSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// chỉ đánh giá 1 lần
reviewSchema.index(
    { productId: 1, userId: 1 },
    { unique: true }
);

reviewSchema.plugin(toJSON);
reviewSchema.plugin(paginate);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
