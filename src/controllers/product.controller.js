const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const productService = require('../services/product.service');

const createProduct = catchAsync(async (req, res) => {
    const imageUrls = req.files?.map((file) => file.path);
    const product = await productService.createProduct({
        ...req.body,
        images: imageUrls,
    });

    res.status(201).send(product);
});

const getProducts = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['categoryId', 'isActive']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await productService.queryProducts(filter, options);
    res.json(result);
});

const getProduct = catchAsync(async (req, res) => {
    const product = await productService.getProductById(req.params.productId);
    if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    res.json(product);
});

const getProductsByCategory = catchAsync(async (req, res) => {
    const products = await productService.getProductsByCategory(req.params.categoryId)
    res.json(products);
})

const updateProduct = catchAsync(async (req, res) => {
    const product = await productService.updateProductById(req.params.productId, req.body);
    res.status(200).json({
        message: 'Cập nhật sản phẩm thành công',
        product,
    });
});

const deleteProduct = catchAsync(async (req, res) => {
    await productService.deleteProductById(req.params.productId);
    res.status(204).json({
        message: 'Xóa sản phẩm thành công',
    });
});

const addImages = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const imageUrls = req.files?.map(file => file.path);
    if (!imageUrls || imageUrls.length === 0) {
        return res.status(400).json({ message: 'Không có ảnh nào được tải lên' });
    }

    const updatedProduct = await productService.addImages(productId, imageUrls);
    res.status(200).json({
        message: 'Thêm ảnh thành công',
        product: updatedProduct,
    });
});

const removeImage = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ message: 'Thiếu URL ảnh cần xóa' });
    }

    const updatedProduct = await productService.removeImage(productId, imageUrl);
    res.status(200).json({
        message: 'Xóa ảnh thành công',
        product: updatedProduct,
    });
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    getProductsByCategory,
    updateProduct,
    deleteProduct,
    addImages,
    removeImage,
};
