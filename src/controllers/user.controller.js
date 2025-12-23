const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const queryUsers = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['categoryId', 'isActive']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const users = await userService.queryUsers(filter, options);
    res.send(users)
});

const updateRole = catchAsync(async (req, res) => {
    const user = await userService.updateRole(req.params.userId, req.body.role);
    res.status(200).json({
        message: 'Cập nhật thành công',
        user
    });
});

const updateProfile = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await userService.updateProfile(userId, req.body);

    res.status(200).json({
        message: 'Cập nhật thành công',
    });
})

module.exports = {
    updateRole,
    queryUsers,
    updateProfile
}