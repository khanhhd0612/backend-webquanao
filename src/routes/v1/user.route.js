const express = require('express');
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations');
const userController = require('../../controllers/user.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.patch('/:userId', validate(userValidation.updateRole), userController.updateRole);

module.exports = router;