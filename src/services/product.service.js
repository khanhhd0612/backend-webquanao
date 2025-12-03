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
    const { page = 1, limit = 10 } = options;

    const query = {};

    if (filter.categories) {
        let categoryIds;

        if (typeof filter.categories === 'string') {
            categoryIds = filter.categories.split(',').filter(id => id.trim());
        } else if (Array.isArray(filter.categories)) {
            categoryIds = filter.categories;
        } else {
            categoryIds = [filter.categories];
        }

        if (categoryIds.length > 0) {
            query.categoryId = categoryIds.length === 1 ? categoryIds[0] : { $in: categoryIds };
        }
    }
    
    if (filter.minPrice || filter.maxPrice) {
        query.basePrice = {};
        if (filter.minPrice) query.basePrice.$gte = Number(filter.minPrice);
        if (filter.maxPrice) query.basePrice.$lte = Number(filter.maxPrice);
    }

    if (filter.isActive !== undefined) {
        query.isActive = filter.isActive === 'true' || filter.isActive === true;
    }

    const results = await Product.find(query)
        .populate('categoryId', 'name')
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const totalResults = await Product.countDocuments(query);

    return {
        results,
        totalResults,
        limit,
        page,
        totalPages: Math.ceil(totalResults / limit),
    };
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

const getProductByCategory = async (slug) => {
    const category = await Category.findOne({ slug })
    const products = await Product.find({ categoryId: category.id })
    return products;
}

const updateProductById = async (productId, updateBody, newImageUrls = null) => {
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

    if (newImageUrls && newImageUrls.length > 0) {
        product.images.push(...newImageUrls);
    }

    delete updateBody.images;

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

const setProductStatus = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Sản phẩm không tồn tại');
    }
    product.isActive = !product.isActive
    await product.save()
    return product
}

module.exports = {
    createProduct,
    queryProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    addImages,
    removeImage,
    setProductStatus,
    getProductByCategory
};
