const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ userId }).populate('items.productId', 'name images basePrice baseDiscountPrice isActive');

    if (!cart) {
        cart = await Cart.create({ userId, items: [] });
        cart = await cart.populate('items.productId', 'name images basePrice baseDiscountPrice isActive');
    }

    return cart;
};

const getCartByUserId = async (userId) => {
    const cart = await Cart.findOne({ userId }).populate({
        path: 'items.productId',
        select: 'name slug images basePrice baseDiscountPrice variants isActive',
    });

    if (!cart) {
        throw new ApiError(404, 'Giỏ hàng không tồn tại');
    }

    return cart;
};

const validateProductAndVariant = async (productId, variant, quantity) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, 'Sản phẩm không tồn tại');
    }

    if (!product.isActive) {
        throw new ApiError(400, 'Sản phẩm không còn kinh doanh');
    }

    let price = product.baseDiscountPrice || product.basePrice;
    let stock = null;

    if (variant && variant.size && variant.color) {
        const productVariant = product.variants.find(
            (v) => v.size === variant.size && v.color === variant.color
        );

        if (!productVariant) {
            throw new ApiError(400, 'Biến thể sản phẩm không tồn tại');
        }

        if (productVariant.stock < quantity) {
            throw new ApiError(400, `Chỉ còn ${productVariant.stock} sản phẩm trong kho`);
        }

        price = productVariant.discountPrice || productVariant.price || price;
        stock = productVariant.stock;
    }

    return { product, price, stock };
};

const addToCart = async (userId, itemData) => {
    const { productId, quantity, variant } = itemData;

    const { price } = await validateProductAndVariant(productId, variant, quantity);

    let cart = await getOrCreateCart(userId);

    const existingItemIndex = cart.findItemIndex(productId, variant);

    if (existingItemIndex > -1) {
        // Update quantity
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;

        // Validate new quantity
        await validateProductAndVariant(productId, variant, newQuantity);

        cart.items[existingItemIndex].quantity = newQuantity;
        cart.items[existingItemIndex].subtotal = price * newQuantity;
    } else {
        cart.items.push({
            productId,
            quantity,
            price,
            variant: variant || {},
            subtotal: price * quantity,
        });
    }

    await cart.save();

    cart = await cart.populate('items.productId', 'name slug images basePrice baseDiscountPrice isActive');

    return cart;
};

const updateCartItem = async (userId, itemId, quantity) => {
    if (quantity < 1) {
        throw new ApiError(400, 'Số lượng phải lớn hơn 0');
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new ApiError(404, 'Giỏ hàng không tồn tại');
    }

    const item = cart.items.id(itemId);

    if (!item) {
        throw new ApiError(404, 'Sản phẩm không có trong giỏ hàng');
    }

    // Validate new quantity
    await validateProductAndVariant(item.productId, item.variant, quantity);

    item.quantity = quantity;
    item.subtotal = item.price * quantity;

    await cart.save();

    return cart.populate('items.productId', 'name slug images basePrice baseDiscountPrice isActive');
};

const removeCartItem = async (userId, itemId) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new ApiError(404, 'Giỏ hàng không tồn tại');
    }

    const item = cart.items.id(itemId);

    if (!item) {
        throw new ApiError(404, 'Sản phẩm không có trong giỏ hàng');
    }

    item.deleteOne();

    await cart.save();

    return cart.populate('items.productId', 'name slug images basePrice baseDiscountPrice isActive');
};

const clearCart = async (userId) => {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
        throw new ApiError(404, 'Giỏ hàng không tồn tại');
    }

    cart.items = [];
    await cart.save();

    return cart;
};

const getCartSummary = async (userId) => {
    const cart = await getCartByUserId(userId);

    return {
        totalItems: cart.totalItems,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.length,
    };
};

module.exports = {
    getOrCreateCart,
    getCartByUserId,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartSummary,
};