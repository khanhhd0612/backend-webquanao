const catchAsync = require('../utils/catchAsync');
const jwt = require("jsonwebtoken");
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const ApiError = require('../utils/ApiError');

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

    const accessToken = jwt.sign({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
    },
        process.env.JWT_SECRET, { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign({
        id: user._id.toString(),
        type: 'refresh'
    },
        process.env.REFRESH_SECRET,
        { expiresIn: "24h" }
    );

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // gửi qua HTTPS
        sameSite: 'strict', //chống CSRF
        maxAge: 24 * 60 * 60 * 1000 // 24h
    });

    res.status(200).json({
        message: "Đăng nhập thành công",
        accessToken
    });
});

const refreshAccessToken = catchAsync(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token không tìm thấy");
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (error) {
        res.clearCookie('refreshToken');
        throw new ApiError(401, "Refresh token không hợp lệ hoặc đã hết hạn");
    }

    const user = await userService.getUserById(decoded.id);

    const newAccessToken = jwt.sign({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role
    },
        process.env.JWT_SECRET, { expiresIn: "15m" }
    );


    res.status(200).json({
        accessToken: newAccessToken
    });
});

const logout = catchAsync(async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
    });

    res.json({ success: true });
});

const changePassword = catchAsync(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await authService.changePassword(userId, oldPassword, newPassword);

    res.status(200).json({
        message: "Cập nhật mật khẩu thành công",
    })

});

const getProfile = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.user.id);

    res.status(200).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
});

module.exports = {
    register,
    login,
    logout,
    changePassword,
    getProfile,
    refreshAccessToken
}
