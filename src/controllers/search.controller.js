const searchService = require('../services/search.service');
const { ApiError } = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync')

const globalSearch = catchAsync(async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
        throw new ApiError(400, 'Từ khóa tìm kiếm phải có ít nhất 2 kí tự');
    }

    const results = await searchService.globalSearch(q);

    res.json(results);
})

const searchOrders = catchAsync(async (req, res) => {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
        throw new ApiError(400, 'Từ khóa tìm kiếm phải có ít nhất 2 kí tự');
    }

    const orders = await searchService.searchOrders(q, Number(limit));

    res.json({ results: orders });
})

const searchUsers = catchAsync(async (req, res) => {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
        throw new ApiError(400, 'Từ khóa tìm kiếm phải có ít nhất 2 kí tự');
    }

    const users = await searchService.searchUsers(q, Number(limit));

    res.json({ results: users });
})

const searchProducts = catchAsync(async (req, res) => {
    const { q, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
        throw new ApiError(400, 'Từ khóa tìm kiếm phải có ít nhất 2 kí tự');
    }

    const products = await searchService.searchProducts(q, Number(limit));

    res.json({ results: products });
})

module.exports = {
    globalSearch,
    searchOrders,
    searchUsers,
    searchProducts
};