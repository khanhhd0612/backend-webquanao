const catchAsync = require('../utils/catchAsync');
const cartService = require('../services/cart.service');

const getCart = catchAsync(async (req, res) => {
    const cart = await cartService.getCartByUserId(req.user.id);
    res.status(200).json({
        message: 'Lấy giỏ hàng thành công',
        cart,
    });
});

const addToCart = catchAsync(async (req, res) => {
    const cart = await cartService.addToCart(req.user.id, req.body);
    res.status(200).json({
        message: 'Thêm vào giỏ hàng thành công',
        cart,
    });
});

const updateCartItem = catchAsync(async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await cartService.updateCartItem(req.user.id, itemId, quantity);
    res.status(200).json({
        message: 'Cập nhật giỏ hàng thành công',
        cart,
    });
});

const removeCartItem = catchAsync(async (req, res) => {
    const { itemId } = req.params;

    const cart = await cartService.removeCartItem(req.user.id, itemId);
    res.status(200).json({
        message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
        cart,
    });
});

const clearCart = catchAsync(async (req, res) => {
    const cart = await cartService.clearCart(req.user.id);
    res.status(200).json({
        message: 'Xóa toàn bộ giỏ hàng thành công',
        cart,
    });
});

const getCartSummary = catchAsync(async (req, res) => {
    const summary = await cartService.getCartSummary(req.user.id);
    res.status(200).json(summary);
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartSummary,
};