const userService = require('./user.service');
const ApiError = require('../utils/ApiError');

const login = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(401, 'Email hoặc mật khẩu không chính xác');
    }
    return user;
};

module.exports = {
    login,
};
