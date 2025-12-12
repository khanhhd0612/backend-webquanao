const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const addressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        fullName: {
            type: String,
            trim: true,
            maxlength: [100, 'Họ tên không được quá 100 ký tự']
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
        },
        address: {
            type: String,
            trim: true,
            maxlength: [200, 'Địa chỉ không được quá 200 ký tự']
        },
        city: {
            type: String,
            trim: true
        },
        district: {
            type: String,
            trim: true
        },
        ward: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            default: 'Vietnam',
            trim: true
        },
        isDefault: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

addressSchema.index({ userId: 1, isDefault: 1 });
addressSchema.plugin(toJSON);
// 1 địa chỉ mặc định cho mỗi user
addressSchema.pre('save', async function (next) {
    if (this.isDefault) {
        await this.constructor.updateMany(
            { userId: this.userId, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

//get địa chỉ mặc định
addressSchema.statics.getDefaultAddress = async function (userId) {
    return await this.findOne({ userId, isDefault: true });
};

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;