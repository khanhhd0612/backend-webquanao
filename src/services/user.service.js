const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(400, 'Email đã được sử dụng');
    }
    return User.create(userBody);
};

const queryUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
};

const getUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User không tồn tại');
    }
    return user
};
const updateRole = async (userId, role) => {
    const user = await getUserById(userId);

    user.role = role;
    await user.save();
    return user;
}

const getUserByEmail = async (email) => {
    return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);

    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(400, 'Email đã được sử dụng');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

const deleteUserById = async (userId) => {
    const user = await getUserById(userId);

    await user.remove();
    return user;
};

const updateProfile = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (updateBody.name) {
        user.name = updateBody.name;
    }
    await user.save();
    return user;
};

module.exports = {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
    updateRole,
    updateProfile
};
