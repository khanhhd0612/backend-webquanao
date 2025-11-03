const cloudinary = require('cloudinary').v2;


const getPublicIdFromUrl = (imageUrl) => {
    const parts = imageUrl.split('/');
    const filename = parts.pop().split('.')[0];
    const uploadIndex = parts.indexOf('upload');

    const afterUpload = parts.slice(uploadIndex + 1).join('/');
    const folderParts = afterUpload.split('/');
    if (folderParts[0].startsWith('v') && !isNaN(folderParts[0].substring(1))) {
        folderParts.shift();
    }

    const folderPath = folderParts.join('/');
    const publicId = folderPath ? `${folderPath}/${filename}` : filename;
    return publicId;
}

const deleteCloudinaryImage = async (imageUrl) => {
    try {
        const publicId = getPublicIdFromUrl(imageUrl);
        if (!publicId) {
            console.warn('Không thể lấy publicId từ URL:', imageUrl);
            return;
        }
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error('Lỗi khi xóa ảnh Cloudinary:', err.message);
    }
}

module.exports = {
    getPublicIdFromUrl,
    deleteCloudinaryImage,
};
