const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async');

// @desc Register user
// @route Get /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async(req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name, email, password, role
    })

    sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password

    if (! email || !password) {
        return next(new errorResponse('Please provide an email and password', 400));
    }
    const user = await User.findOne({email}).select('+password');

    if( ! user) {
        return next(new errorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if ( ! isMatch) {
        return next(new errorResponse('Invalid credentials', 401));
    }
    sendTokenResponse(user, 200, res);
});


exports.getMe = asyncHandler(async (req, res, next) => { 
    const user = await User.findById(req.user.id);

    res.status(200).json({ success: true, data: user });
});
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now()  + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 100),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token});
}