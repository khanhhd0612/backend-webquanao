const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email không hợp lệ.');
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error('Mật khẩu phải chứa ít nhất một chữ cái và một chữ số.');
                }
            },
            private: true,
        },
        role: {
            type: String,
            enum: roles,
            default: 'user',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },

        phone: {
            type: String,
            trim: true,
            validate(value) {
                if (value && !validator.isMobilePhone(value, 'any')) {
                    throw new Error('Số điện thoại không hợp lệ.');
                }
            },
        },
        address: {
            type: String,
            trim: true,
            default: '',
        },
        avatar: {
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

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Kiểm tra email đã tồn tại 
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

/**
 * So khớp mật khẩu
 */
userSchema.methods.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
};

/**
 * Hash mật khẩu 
 */
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

/**
 * Virtual field
 */
userSchema.virtual('profile').get(function () {
    return {
        name: this.name,
        email: this.email,
        role: this.role,
        phone: this.phone,
        address: this.address,
        avatar: this.avatar,
    };
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
