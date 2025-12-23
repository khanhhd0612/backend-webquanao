const userService = require('./user.service');
const ApiError = require('../utils/ApiError');

const login = async (email, password) => {
    const user = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(401, 'Email hoặc mật khẩu không chính xác');
    }
    return user;
};

const changePassword = async (email, oldPassword, newPassword) => {
    const user = await userService.getUserByEmail(email);

    if (!user || !(await user.isPasswordMatch(oldPassword))) {
        throw new ApiError(401, 'Email hoặc mật khẩu không chính xác');
    }
    user.password = newPassword;
    await user.save();
    return user;
}

module.exports = {
    login,
    changePassword
};
