const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);

router.post('/login', validate(authValidation.login), authController.login);

router.post('/refresh', authController.refreshAccessToken);

router.get('/profile', auth(), authController.getProfile);

router.post('/change-password', auth(), validate(authValidation.changePassword), authController.changePassword);

router.post('/logout', auth(), authController.logout);


module.exports = router;