const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const addressValidation = require('../../validations/address.validation');
const addressController = require('../../controllers/address.controller');

const router = express.Router();

router
    .route('/')
    .post(auth(), validate(addressValidation.createAddress), addressController.createAddress)
    .get(auth(), addressController.getAddresses);

router
    .route('/:addressId')
    .get(auth(), validate(addressValidation.getAddress), addressController.getAddress)
    .patch(auth(), validate(addressValidation.updateAddress), addressController.updateAddress)
    .delete(auth(), validate(addressValidation.deleteAddress), addressController.deleteAddress);

router
    .route('/:addressId/default')
    .patch(auth(), validate(addressValidation.setDefaultAddress), addressController.setDefaultAddress);

module.exports = router;