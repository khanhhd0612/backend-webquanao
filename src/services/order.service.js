const { Order, Product } = require('../models');
const ApiError = require('../utils/ApiError');

const validateProductAndVariant = async (productId, variant, quantity) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, 'Sản phẩm không tồn tại');
    }
    if (!product.isActive) {
        throw new ApiError(400, 'Sản phẩm không còn kinh doanh');
    }
    let price = product.baseDiscountPrice || product.basePrice;
    if (variant && variant.size && variant.color) {
        const productVariant = product.variants.find(
            (v) => v.size === variant.size && v.color === variant.color
        );

        if (!productVariant) {
            throw new ApiError(400, 'Biến thể sản phẩm không tồn tại');
        }

        if (productVariant.stock < quantity) {
            throw new ApiError(400, `Chỉ còn ${productVariant.stock} sản phẩm trong kho`);
        }
        if (productVariant.discountPrice || productVariant.price) {
            price = productVariant.discountPrice || productVariant.price;
        }
    }

    return { product, price };
};

const createOrder = async (orderBody) => {
    let totalPrice = 0;

    const detailedOrderDetails = await Promise.all(
        orderBody.orderDetails.map(async (item) => {
            const { price } = await validateProductAndVariant(
                item.productId,
                item.variant,
                item.quantity
            );

            const subtotal = price * Number(item.quantity);
            totalPrice += subtotal;

            return {
                ...item,
                price,
                subtotal,
            };
        })
    );
    totalPrice += orderBody.shippingFee || 0;
    const order = await Order.create({
        ...orderBody,
        orderDetails: detailedOrderDetails,
        totalPrice,
    });
    return order;
};

const getOrders = async (filter, options) => {
    const orders = await Order.paginate(filter, options);
    return orders;
};

const getOderOfUser = async (userId) => {
    const orders = await Order.find({ userId })
    return orders
}

const getOrderById = async (orderId) => {
    const order = await Order.findById(orderId).populate('userId').populate('orderDetails.productId');
    if (!order) throw new ApiError(404, 'Order not found');
    return order;
};

const updateOrderStatus = async (orderId, updateBody) => {
    const order = await getOrderById(orderId);
    Object.assign(order, updateBody);
    await order.save();
    return order;
};


module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getOderOfUser
};
