const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', auth('manager'), userController.queryUsers);

router.patch('/:userId', auth('manager'), validate(userValidation.updateRole), userController.updateRole);

module.exports = router;