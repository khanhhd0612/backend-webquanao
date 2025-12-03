const express = require('express');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');
const upload = require('../../middlewares/upload');
const auth = require('../../middlewares/auth');
const parseFormData = require('../../middlewares/parseFormData');

const router = express.Router();

router.post('/', auth('manager'), upload.array('images', 10), parseFormData, validate(productValidation.createProduct), productController.createProduct);

router.get('/', validate(productValidation.getProducts), productController.getProducts);

router.get('/:productId', validate(productValidation.getProduct), productController.getProduct);

router.put('/:productId', auth('manager'), upload.array('images', 10), parseFormData, validate(productValidation.updateProduct), productController.updateProduct);

router.delete('/:productId', auth('manager'), validate(productValidation.deleteProduct), productController.deleteProduct);

router.post('/:productId/images', auth('manager'), upload.array('images', 10), productController.addImages);

router.delete('/:productId/images', auth('manager'), productController.removeImage);

router.patch('/:productId/status', auth('manager'), productController.setProductStatus);

router.get('/category/:slug', productController.getProductByCategory);

module.exports = router;