const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        image: {
            type: String,
            default: '',
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

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,     // chuyển về chữ thường
            strict: true,    // bỏ ký tự đặc biệt
            locale: 'vi',
        });
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
