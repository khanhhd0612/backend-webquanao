const { userService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const updateRole = catchAsync(async (req, res) => {
    const user = await userService.updateRole(req.params.userId, req.body.role);
    res.status(200).json({
        message: 'Cập nhật thành công',
        user
    });
})

module.exports = {
    updateRole
}