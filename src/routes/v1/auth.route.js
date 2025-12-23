const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);

router.get('/me', auth(), (req, res) => {
    res.json({ user: req.user });
})

router.post('/change-password',validate(authValidation.changePassword),  authController.changePassword);

router.post('/login', validate(authValidation.login), authController.login);

router.post('/logout', auth(), authController.logout);


module.exports = router;