const express = require('express');
const searchController = require('../../controllers/search.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth(), searchController.globalSearch);

router.get('/orders', auth(), searchController.searchOrders);

router.get('/users', auth('manageUsers'), searchController.searchUsers);

router.get('/products', auth(), searchController.searchProducts);

module.exports = router;