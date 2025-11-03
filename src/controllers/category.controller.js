const categoryService = require('../services/category.service');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const createCategory = catchAsync(async (req, res) => {
    req.body.image = req.file.path;
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({
        message: 'Tạo thành công',
        category
    });
})
    ;
const setStatus = catchAsync(async (req, res) => {
    const category = await categoryService.setStatus(req.params.categoryId);
    res.status(200).json({
        message: 'Cập nhật thành công',
        category
    });
})

const getCategories = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name', 'isActive']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const categories = await categoryService.queryCategories(filter, options);
    res.json(categories);
})

const getCategory = catchAsync(async (req, res) => {
    const category = await categoryService.getCategory(req.params.categoryId);
    res.json(category);
})

const updateCategory = catchAsync(async (req, res) => {
    if (req.file.path) {
        req.body.image = req.file.path;
    }
    const category = await categoryService.updateCategory(req.params.categoryId, req.body);
    res.status(200).json({
        message: 'Cập nhật thành công',
        category
    });
})

const deleteCategory = catchAsync(async (req, res) => {
    await categoryService.deleteCategory(req.params.categoryId);
    res.status(204).json({
        message: 'Xóa thành công',
    })
})

module.exports = {
    createCategory,
    setStatus,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}