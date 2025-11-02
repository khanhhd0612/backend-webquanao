const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const categoryValidation = require('../../validations/category.validation');
const categoryController = require('../../controllers/category.controller');

const router = express.Router();

router.post('/', auth('manageCategories'), validate(categoryValidation.createCategory), categoryController.createCategory);

router.get('/', validate(categoryValidation.getCategories), categoryController.getCategories);

router.get('/:categoryId', validate(categoryValidation.getCategory), categoryController.getCategory);

router.put('/:categoryId', auth('manageCategories'), validate(categoryValidation.updateCategory), categoryController.updateCategory);

router.delete('/:categoryId', auth('manageCategories'), validate(categoryValidation.getCategory), categoryController.deleteCategory);

router.patch('/:categoryId/status', auth('manageCategories'), validate(categoryValidation.getCategory), categoryController.setStatus);

module.exports = router;