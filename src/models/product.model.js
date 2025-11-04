const mongoose = require('mongoose');
const slugify = require('slugify');
const { toJSON, paginate } = require('./plugins');

//biến thể sản phẩm
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
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        price: {
            type: Number,
            min: 0,
        },
        discountPrice: {
            type: Number,
            min: 0,
        },
    },
);

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        basePrice: {
            type: Number,
            required: true,
            min: 0,
        },
        baseDiscountPrice: {
            type: Number,
            default: 0,
            min: 0,
        },
        images: {
            type: [String],
            default: [],
        },
        variants: [variantSchema],
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            locale: 'vi',
        });
    }
    next();
});

productSchema.index({ name: 'text', slug: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
