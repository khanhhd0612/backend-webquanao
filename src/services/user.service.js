const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const createUser = async (userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(400, 'Email already taken');
    }
    return User.create(userBody);
};

const queryUsers = async (filter, options) => {
    const users = await User.paginate(filter, options);
    return users;
};

const getUserById = async (userId) => {
    return User.findById(userId);
};
const updateRole = async (userId, role) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    user.role = role;
    await user.save();
    return user;
}

const getUserByEmail = async (email) => {
    return User.findOne({ email });
};

const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(400, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

const deleteUserById = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    await user.remove();
    return user;
};

module.exports = {
    createUser,
    queryUsers,
    getUserById,
    getUserByEmail,
    updateUserById,
    deleteUserById,
    updateRole
};
