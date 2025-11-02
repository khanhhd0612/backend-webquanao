const express = require('express');
const validate = require('../../middlewares/validate');
const wishListValidation = require('../../validations/wishList.validation');
const wishListController = require('../../controllers/wishList.controller');
const auth = require('../../middlewares/auth')

const router = express.Router();

router.post('/', auth(), validate(wishListValidation.addToWishList), wishListController.addToWishList);

router.get('/', auth(), wishListController.getWishList);

router.patch('/:productId', auth(), wishListController.removeFromWishList);

router.delete('/', auth(), wishListController.clearWhishList);

module.exports = router