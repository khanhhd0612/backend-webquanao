const WishList = require('../models/wishList.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');

const getOrCreatWishList = async (userId) => {
    let wishList = await WishList.findOne({ userId });

    if (!wishList) {
        wishList = await WishList.create({ userId, products: [] });
        wishList = await WishList.populate('products.productId', 'name images basePrice baseDiscountPrice isActive');
    }

    return wishList;
}

const getWishListByUserId = async (userId) => {
    const wishList = await WishList.findOne({ userId }).populate({
        path: 'products.productId',
        select: 'name slug images basePrice baseDiscountPrice variants isActive',
    });

    if (!wishList) {
        throw new ApiError(404, 'Danh sách không tồn tại');
    }

    return wishList;
};

const removeFromWishList = async (userId, productId) => {
    const wishList = await WishList.findOne({ userId })

    if (!wishList) {
        throw new ApiError(404, 'Danh sách không tồn tại');
    }

    const product = wishList.products.id(productId);

    if (!product) {
        throw new ApiError(404, 'Sản phẩm không tồn tại trong danh sách');
    }
    product.deleteOne();
    await wishList.save();

    return wishList.populate('products.productId', 'name slug images basePrice baseDiscountPrice isActive');;
}

const addToWishList = async (userId, productData) => {
    const { productId } = productData;

    let wishList = await getOrCreatWishList(userId);

    const existingItemIndex = wishList.findItemIndex(productId);

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, 'Sản phẩm không tồn tại');
    }

    if (existingItemIndex < 0) {
        wishList.products.push(productData)
    }
    await wishList.save();

    wishList = await wishList.populate('products.productId', 'name slug images basePrice baseDiscountPrice isActive');

    return wishList;
}

const clearWhishList = async (userId) => {
    let wishList = await WishList.findOne({ userId });

    if (!wishList) {
        throw new ApiError(404, 'Danh sách không tồn tại');
    }

    wishList.products = [];

    await wishList.save();

    return wishList
}

module.exports = {
    clearWhishList,
    addToWishList,
    removeFromWishList,
    getWishListByUserId
}