const Product = require('../models/product.model');
const Category = require('../models/category.model');
const ApiError = require('../utils/ApiError');
const slugify = require('slugify');
const { deleteCloudinaryImage } = require('../utils/deleteImage');

const createProduct = async (productBody) => {
    const category = await Category.findById(productBody.categoryId);

    if (!category) throw new ApiError(400, 'Danh mục không hợp lệ');

    const slug = slugify(productBody.name, { lower: true, strict: true, locale: 'vi' });

    productBody.slug = slug;
    const product = await Product.create(productBody);
    return product;
};

const queryProducts = async (filter, options) => {
    const products = await Product.paginate(filter, options);
    return products;
};

const getProductById = async (productId) => {
    const product = await Product.findById(productId).populate('categoryId', 'name');
    return product;
};

const addImages = async (productId, imageUrls) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Sản phẩm không tồn tại');
    }
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        product.images.push(...imageUrls);
    } else if (typeof imageUrls === 'string') {
        product.images.push(imageUrls);
    }
    await product.save();
    return product;
};

const updateProductById = async (productId, updateBody) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Sản phẩm không tồn tại');
    }

    if (updateBody.name) {
        updateBody.slug = slugify(updateBody.name, {
            lower: true,
            strict: true,
            locale: 'vi',
        });
    }

    Object.assign(product, updateBody);
    await product.save();
    return product;
};

const removeImage = async (productId, imageUrl) => {
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, 'Sản phẩm không tồn tại');

    await deleteCloudinaryImage(imageUrl)

    product.images = product.images.filter((img) => img !== imageUrl);
    await product.save();

    return product;
};

const deleteProductById = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Sản phẩm không tồn tại');
    }

    if (product.images && product.images.length > 0) {
        await Promise.all(product.images.map(deleteCloudinaryImage));
    }
    
    await product.deleteOne();
    return product;
};

module.exports = {
    createProduct,
    queryProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    addImages,
    removeImage
};
