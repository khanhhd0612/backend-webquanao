const catchAsync = require('../utils/catchAsync');
const addressService = require('../services/address.service');

const createAddress = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const address = await addressService.createAddress(userId, req.body);

    res.status(201).json({
        success: true,
        message: 'Thêm địa chỉ thành công',
        address
    });
});

const getAddresses = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const addresses = await addressService.getAddresses(userId);

    res.status(200).json({
        success: true,
        count: addresses.length,
        addresses
    });
});

const getAddress = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.addressId;
    const address = await addressService.getAddress(userId, addressId);

    res.status(200).json({
        success: true,
        address
    });
});

const updateAddress = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.addressId;
    const address = await addressService.updateAddress(userId, addressId, req.body);

    res.status(200).json({
        success: true,
        message: 'Cập nhật địa chỉ thành công',
        address
    });
});

const deleteAddress = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.addressId;
    await addressService.deleteAddress(userId, addressId);

    res.status(200).json({
        success: true,
        message: 'Xóa địa chỉ thành công'
    });
});

const setDefaultAddress = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const addressId = req.params.addressId;
    const address = await addressService.setDefaultAddress(userId, addressId);

    res.status(200).json({
        success: true,
        message: 'Đã đặt làm địa chỉ mặc định',
        address
    });
});

module.exports = {
    createAddress,
    getAddresses,
    getAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};