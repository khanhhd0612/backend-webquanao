const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');


const globalSearch = async (searchTerm) => {
    const term = searchTerm.trim();

    const [orders, customers, products] = await Promise.all([
        searchOrders(term, 5),
        searchUsers(term, 5),
        searchProducts(term, 5)
    ]);

    return {
        orders,
        customers,
        products
    };
}


const searchOrders = async (searchTerm, limit = 20) => {
    const searchConditions = [
        { 'userId.name': { $regex: searchTerm, $options: 'i' } },
        { 'userId.email': { $regex: searchTerm, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: searchTerm, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: searchTerm, $options: 'i' } }
    ];

    // Nếu searchTerm là ObjectId hợp lệ tìm theo _id
    if (searchTerm.match(/^[0-9a-fA-F]{24}$/)) {
        searchConditions.push({ _id: searchTerm });
    }

    const orders = await Order.find({
        $or: searchConditions
    })
        .limit(limit)
        .select('_id totalPrice userId shippingAddress orderStatus createdAt')
        .sort({ createdAt: -1 })
        .lean();

    return orders.map(order => ({
        id: order._id,
        totalPrice: order.totalPrice,
        customerName: order.userId?.name || order.shippingAddress?.fullName || 'N/A',
        email: order.userId?.email || '',
        phone: order.shippingAddress?.phone || '',
        status: order.orderStatus,
        createdAt: order.createdAt
    }));
}

const searchUsers = async (searchTerm, limit = 10) => {
    const users = await User.find({
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } }
        ],
        role: 'user'
    })
        .limit(limit)
        .select('_id name email phone createdAt')
        .sort({ createdAt: -1 })
        .lean();

    return users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    }));
}

const searchProducts = async (searchTerm, limit = 10) => {
    const products = await Product.find({
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { 'category.name': { $regex: searchTerm, $options: 'i' } }
        ]
    })
        .limit(limit)
        .select('_id name basePrice slug images baseDiscountPrice categoryId')
        .populate('categoryId', 'name')
        .sort({ createdAt: -1 })
        .lean();

    return products.map(product => ({
        id: product._id,
        name: product.name,
        slug: product.slug,
        images: product.images,
        basePrice: product.basePrice,
        baseDiscountPrice: product.baseDiscountPrice,
        category: product.categoryId?.name || ''
    }));
}

module.exports = {
    globalSearch,
    searchOrders,
    searchUsers,
    searchProducts
}