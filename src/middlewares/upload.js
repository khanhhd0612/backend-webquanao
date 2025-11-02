const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'exam_uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
        transformation: [{ quality: 'auto' }],
    },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
