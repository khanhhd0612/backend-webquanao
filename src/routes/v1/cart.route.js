const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const cartValidation = require('../../validations/cart.validation');
const cartController = require('../../controllers/cart.controller');

const router = express.Router();


router.get('/', auth(), cartController.getCart);

router.post('/', auth(), validate(cartValidation.addToCart), cartController.addToCart);

router.delete('/', auth(), cartController.clearCart);

router.get('/summary', auth(), cartController.getCartSummary);

router.put('/items/:itemId', auth(), validate(cartValidation.updateCartItem), cartController.updateCartItem);

router.delete('/items/:itemId', auth(), validate(cartValidation.removeCartItem), cartController.removeCartItem);

module.exports = router;