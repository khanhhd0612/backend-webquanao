const wishListService = require('../services/wishList.service');
const catchAsync = require('../utils/catchAsync');

const addToWishList = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const wishList = await wishListService.addToWishList(userId, req.body);

    res.status(201).json({
        message: "Thêm thành công",
        wishList
    })
})

const getWishList = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const wishList = await wishListService.getWishListByUserId(userId);
    res.send(wishList)
})

const removeFromWishList = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const wishList = await wishListService.removeFromWishList(userId, req.params.productId);

    res.status(204).json({
        message: "Xóa thành công",
        wishList
    })
})

const clearWhishList = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const wishList = await wishListService.clearWhishList(userId);

    res.status(204).json({
        message: "Xóa danh sách thành công",
        wishList
    })
})

module.exports = {
    addToWishList,
    removeFromWishList,
    clearWhishList,
    getWishList
}