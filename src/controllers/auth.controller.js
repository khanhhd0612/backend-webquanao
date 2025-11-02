const catchAsync = require('../utils/catchAsync');
const jwt = require("jsonwebtoken");
const { userService, authService } = require('../services');

const register = catchAsync(async (req, res) => {
    const user = await userService.createUser(req.body);
    res.status(201).json({
        message: "Đăng kí thành công",
        user
    });
});
const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.login(email, password);

    const payload = {
        sub: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.status(200).json({
        message: "Đăng nhập thành công",
        token
    });
});


module.exports = {
    register,
    login
}
