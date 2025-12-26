const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const couponUsage = require('../models/couponUsage.model');
const ApiError = require('../utils/ApiError');

const validateProductAndVariant = async (productId, variant, quantity, session) => {
    const product = await Product.findById(productId).session(session);

    if (!product) {
        throw new ApiError(404, 'Sản phẩm không tồn tại');
    }

    if (!product.isActive) {
        throw new ApiError(400, 'Sản phẩm không còn kinh doanh');
    }

    let price = product.baseDiscountPrice || product.basePrice;
    let variantInfo = null;

    // Xử lý sản phẩm có biến thể
    if (variant && variant.length > 0 && variant[0].size && variant[0].color) {
        const requestedVariant = variant[0];
        const productVariant = product.variants.find(
            (v) => v.size === requestedVariant.size && v.color === requestedVariant.color
        );

        if (!productVariant) {
            throw new ApiError(400, 'Biến thể sản phẩm không tồn tại');
        }

        if (productVariant.stock < quantity) {
            throw new ApiError(
                400, `Biến thể ${requestedVariant.size}-${requestedVariant.color} chỉ còn ${productVariant.stock} sản phẩm trong kho`
            );
        }

        // Ưu tiên giá giảm giá của variant
        price = productVariant.discountPrice || productVariant.price || price;
        variantInfo = {
            size: productVariant.size,
            color: productVariant.color,
        };
    }
    // Xử lý sản phẩm không có biến thể
    else {
        // buộc phải chọn variant
        if (product.variants && product.variants.length > 0) {
            throw new ApiError(400, 'Vui lòng chọn size và màu sắc cho sản phẩm này');
        }
    }

    return { product, price, variantInfo };
};

const createOrder = async (orderBody) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let totalPrice = 0;
        const detailedOrderDetails = [];
        const stockUpdates = [];

        for (const item of orderBody.orderDetails) {
            const { product, price, variantInfo } = await validateProductAndVariant(
                item.productId,
                item.variant,
                item.quantity,
                session
            );

            const subtotal = price * Number(item.quantity);
            totalPrice += subtotal;

            detailedOrderDetails.push({
                productId: item.productId,
                productName: product.name,
                productImage: product.images[0],
                productSlug: product.slug,
                quantity: item.quantity,
                price,
                subtotal,
                variant: variantInfo ? [variantInfo] : [],
            });

            // cập nhật tồn kho
            if (variantInfo) {
                stockUpdates.push({
                    productId: item.productId,
                    variant: variantInfo,
                    quantity: item.quantity,
                });
            }
        }

        totalPrice += orderBody.shippingFee || 0;
        if (orderBody.discount) {
            totalPrice -= orderBody.discount;
        }

        const order = await Order.create(
            [
                {
                    ...orderBody,
                    orderDetails: detailedOrderDetails,
                    totalPrice,
                }
            ],
            { session }
        );

        // xập nhật tồn kho với atomic operation
        for (const update of stockUpdates) {
            const result = await Product.updateOne(
                {
                    _id: update.productId,
                    'variants.size': update.variant.size,
                    'variants.color': update.variant.color,
                    'variants.stock': { $gte: update.quantity }, // Đảm bảo vẫn còn đủ hàng
                },
                {
                    $inc: { 'variants.$.stock': -update.quantity }
                },
                { session }
            );

            // Kiểm tra xem có cập nhật được không tránh race condition
            if (result.modifiedCount === 0) {
                throw new ApiError(400, `Sản phẩm ${update.variant.size}-${update.variant.color} đã hết hàng`);
            }
        }

        await session.commitTransaction();
        return order[0];

    } catch (error) {
        // Rollback nếu có lỗi
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const paymentByVnpay = async (orderId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, 'Không tìm thấy đơn hàng');
    }

    if (order.paymentStatus === 'paid') {
        throw new ApiError(400, 'Đơn hàng đã được thanh toán trước đó');
    }

    if (order.orderStatus === 'cancelled') {
        throw new ApiError(400, 'Không thể thanh toán cho đơn hàng đã hủy');
    }

    order.paymentMethod = 'VNPay';
    order.paymentStatus = 'paid';

    await order.save();
    return order;
};

const getOrders = async (filter, options) => {
    const orders = await Order.paginate(filter, options);
    return orders;
};

const getOrdersOfUser = async (userId, options = {}) => {
    const { sortBy = '-createdAt', limit = 10, page = 1, status } = options;

    const filter = { userId };

    if (status) {
        filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
        .sort(sortBy)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

    const total = await Order.countDocuments(filter);

    return {
        results: orders,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalResults: total,
    };
};

const getOrderById = async (orderId) => {
    const order = await Order.findById(orderId)
        .populate('userId', 'name email phone')
        .populate('orderDetails.productId', 'name images slug categoryId');

    if (!order) {
        throw new ApiError(404, 'Không tìm thấy đơn hàng');
    }

    return order;
};

const updateOrderStatus = async (orderId, updateBody) => {
    const order = await getOrderById(orderId);

    // chuyển đổi trạng thái hợp lệ
    const validTransitions = {
        pending: ['confirmed', 'cancelled'],
        confirmed: ['shipped', 'cancelled'],
        shipped: ['delivered', 'cancelled'],
        delivered: ['delivered'], // Không thể thay đổi từ delivered
        cancelled: ['cancelled'], // Không thể thay đổi từ cancelled
    };

    if (updateBody.orderStatus) {
        const currentStatus = order.orderStatus;
        const newStatus = updateBody.orderStatus;
        const allowedStatuses = validTransitions[currentStatus] || [];

        if (!allowedStatuses.includes(newStatus)) {
            throw new ApiError(
                400,
                `Không thể chuyển trạng thái đơn hàng từ "${currentStatus}" sang "${newStatus}"`
            );
        }

        // hủy đơn hàng trả lại tồn kho
        if (newStatus === 'cancelled' && currentStatus !== 'cancelled') {
            await restoreInventory(order);
        }
    }

    const allowedUpdates = ['orderStatus', 'paymentStatus', 'notes'];
    Object.keys(updateBody).forEach((key) => {
        if (allowedUpdates.includes(key)) {
            order[key] = updateBody[key];
        }
    });

    await order.save();
    return order;
};

const restoreInventory = async (order) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        for (const item of order.orderDetails) {
            // Chỉ hoàn kho cho sản phẩm có variant
            if (item.variant && item.variant.length > 0) {
                const variant = item.variant[0];
                await Product.updateOne(
                    {
                        _id: item.productId,
                        'variants.size': variant.size,
                        'variants.color': variant.color,
                    },
                    {
                        $inc: { 'variants.$.stock': item.quantity }
                    },
                    { session }
                );
            }
        }

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw new ApiError(500, 'Lỗi khi hoàn lại tồn kho');
    } finally {
        session.endSession();
    }
};

const cancelOrder = async (orderId, userId, reason, note) => {
    const order = await getOrderById(orderId);

    if (userId && order.userId.toString() !== userId.toString()) {
        throw new ApiError(403, 'Bạn không có quyền hủy đơn hàng này');
    }

    if (order.orderStatus === 'delivered') {
        throw new ApiError(400, 'Không thể hủy đơn hàng đã giao');
    }

    if (order.orderStatus === 'shipped') {
        throw new ApiError(400, 'Không thể hủy đơn hàng đang vận chuyển');
    }

    if (order.orderStatus === 'cancelled') {
        throw new ApiError(400, 'Đơn hàng đã được hủy trước đó');
    }

    // Hoàn lại tồn kho
    await restoreInventory(order);

    order.cancellation = {
        reason: reason,
        note: note || '',
        cancelledAt: new Date()
    };

    order.orderStatus = 'cancelled';

    await order.save();
    return order;
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    getOrdersOfUser,
    paymentByVnpay,
    cancelOrder,
    restoreInventory,
};