const Category = require('../models/category.model');
const ApiError = require('../utils/ApiError');
const slugify = require('slugify')
const { deleteCloudinaryImage } = require('../utils/deleteImage');

const createCategory = async (categoryBody) => {
    const existing = await Category.find({ name: categoryBody.name });
    if (existing) {
        await deleteCloudinaryImage(categoryBody.image)
        throw new ApiError(404, 'Danh mục đã tồn tại');
    }
    const category = await Category.create(categoryBody);
    return category;
}

const queryCategories = async (filter, options) => {
    const categories = await Category.paginate(filter, options);
    return categories;
}

const getCategory = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, 'Danh mục không tồn tại')
    }
    return category;
}

const setStatus = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, 'Danh mục không tồn tại');
    }

    category.isActive = !category.isActive;

    await category.save();

    return category;
}

const updateCategory = async (categoryId, updateBody) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, 'Danh mục không tồn tại');
    }
    if (updateBody.image && category.image) {
        await deleteCloudinaryImage(category.image)
    }
    if (updateBody.name) {
        updateBody.slug = slugify(updateBody.name, { lower: true });
    }
    Object.assign(category, updateBody);
    await category.save();
    return category;
}


const deleteCategory = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, 'Danh mục không tồn tại');
    }

    if (category.image) {
        await deleteCloudinaryImage(category.image)
    }

    await category.deleteOne();
    return;
};


module.exports = {
    createCategory,
    queryCategories,
    getCategory,
    setStatus,
    updateCategory,
    deleteCategory
}