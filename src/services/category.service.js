const Category = require('../models/category.model');
const ApiError = require('../utils/ApiError');

const createCategory = async (categoryBody) => {
    console.log(categoryBody)
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
        throw ApiError(404, 'Danh mục không tồn tại')
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
    await category.deleteOne();
    return;
}


module.exports = {
    createCategory,
    queryCategories,
    getCategory,
    setStatus,
    updateCategory,
    deleteCategory
}