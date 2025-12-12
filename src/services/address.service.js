const Address = require('../models/address.model');
const ApiError = require('../utils/ApiError');

const createAddress = async (userId, addressBody) => {
    const addressCount = await Address.countDocuments({ userId });
    const shouldBeDefault = addressCount === 0 ? true : (addressBody.isDefault || false);

    const address = await Address.create({
        userId: userId,
        fullName: addressBody.fullName,
        phone: addressBody.phone,
        address: addressBody.address,
        city: addressBody.city,
        district: addressBody.district,
        ward: addressBody.ward,
        country: addressBody.country || 'Vietnam',
        isDefault: shouldBeDefault,
    });
    return address;
}

const getAddresses = async (userId) => {
    const addresses = await Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    return addresses;
}

const getAddress = async (userId, addressId) => {
    const address = await Address.findOne({
        _id: addressId,
        userId
    });

    if (!address) {
        throw new ApiError(404, 'Không tìm thấy địa chỉ');
    }

    return address;
};

const updateAddress = async (userId, addressId, updateBody) => {
    const address = await Address.findById(addressId);

    if (!address) {
        throw new ApiError(404, 'Địa chỉ không tồn tại.');
    }

    if (address.userId.toString() !== userId.toString()) {
        throw new ApiError(403, 'Bạn không thể chỉnh sửa địa chỉ của người khác.');
    }

    Object.assign(address, updateBody);
    await address.save();
    return address;
}

const deleteAddress = async (userId, addressId) => {
    const address = await Address.findOne({
        _id: addressId,
        userId
    });

    if (!address) {
        throw new ApiError(404, 'Không tìm thấy địa chỉ');
    }

    // Nếu xóa địa chỉ mặc định, set địa chỉ khác làm mặc định
    if (address.isDefault) {
        const otherAddress = await Address.findOne({
            userId,
            _id: { $ne: addressId }
        });

        if (otherAddress) {
            otherAddress.isDefault = true;
            await otherAddress.save();
        }
    }

    await address.deleteOne();
    return true;
};

const setDefaultAddress = async (userId, addressId) => {
    const address = await Address.findOne({
        _id: addressId,
        userId
    });

    if (!address) {
        throw new ApiError(404, 'Không tìm thấy địa chỉ');
    }

    await Address.updateMany(
        { userId: userId },
        { isDefault: false }
    );

    address.isDefault = true;
    await address.save();

    return address;
};

module.exports = {
    getAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};