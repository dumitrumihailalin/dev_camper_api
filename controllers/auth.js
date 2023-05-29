const crypto = require('crypto');
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

exports.forgotPassword = asyncHandler(async (req, res, next) => { 
    const user = await User.findOne({ email: req.body.email });
    if (!user) { 
        return next(new errorResponse(`There is not user with that email`, 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: user });
});

exports.resetPassword = asyncHandler(async (req, res, next) => { 
    // Get hashed token
    const resetPasswordToken = req.params.resettoken;
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new errorResponse('Invalid token'), 400);
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendTokenResponse(user, 200, res);
});

exports.updateUserDetails = asyncHandler(async (req, res, next) => { 
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: user });
});

exports.updatePassword = asyncHandler(async (req, res, next) => { 
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))){
        return next(new errorResponse('Password is incorrect'), 401);
    }

    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
});

exports.logout = asyncHandler(async (req, res, next) => { 
  res.cookie('token', 'none', {
    expires: new Date(Date.now()  + 10  * 1000),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    data: {}
  });
});