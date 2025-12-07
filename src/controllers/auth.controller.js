const catchAsync = require('../utils/catchAsync');
const jwt = require("jsonwebtoken");
const authService = require('../services/auth.service');
const userService = require('../services/user.service');

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
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });

    res.cookie('jwt', token, {
        httpOnly: true, // không cho JS truy cập
        secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trong production
        sameSite: 'strict', //chống CSRF
        maxAge: 24 * 60 * 60 * 1000 // 24h
    });

    res.status(200).json({
        message: "Đăng nhập thành công",
    });
});

const logout = catchAsync(async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });

    res.json({ success: true });
})


module.exports = {
    register,
    login,
    logout
}
