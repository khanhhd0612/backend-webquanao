const cron = require('node-cron');
const { Cart } = require('../models');
const logger = require('../config/logger');

/**
 * Clean expired carts every day at 2 AM
 * Cron pattern: minute hour day month weekday
 * 0 2 * * * = At 02:00 AM every day
 */
const cleanExpiredCartsJob = cron.schedule('0 2 * * *', async () => {
    try {
        logger.info('Starting expired carts cleanup job...');

        const result = await Cart.cleanExpiredCarts();

        logger.info(`Expired carts cleanup completed. Deleted ${result.deletedCount} carts.`);
    } catch (error) {
        logger.error('Error cleaning expired carts:', error);
    }
}, {
    scheduled: false,
    timezone: 'Asia/Ho_Chi_Minh'
});

module.exports = cleanExpiredCartsJob;