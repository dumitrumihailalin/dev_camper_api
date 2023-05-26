const User = require("../models/User");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async');
// @desc Get all users
// @route Get /api/v1/auth/users
// @access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
   
    const users = await User.find();
    res.status(200).json({success: true, data: users});
})

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    
    if (req.user.role !== 'admin') {
        return next(new errorResponse(`User ${req.user.name} is not authorized`), 401);
    }

    if ( ! user) {
        return next(new errorResponse(`User not found with id of ${req.params.id}`), 404);
    }
    res.status(200).json({success: true, data: user});
});


// @desc Create user
// @route Post /api/v1/users
// @access Public

exports.createUser = asyncHandler(async(req, res, next) => {
    let user = await User.findOne({ email: req.body.email});
    if (user) {
        return next(
            new errorResponse(`User with email ${req.body.email} already exists`), 403
        );
    }

    if (req.user.role !== 'admin') {
        return next(new errorResponse(`User ${req.user.name} is not authorized`), 401);
    }

    user = await User.create(req.body)
    res.status(200).json({success: true, data: user});
});


exports.updateUser = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (! user) {
        return next(
            new errorResponse(`User not found with id of ${req.parms.id}`), 404
        );
    }
    
    if (req.user.role !== 'admin') {
        return next(new errorResponse(`User ${req.user.name} is not authorized`), 401);
    }
   
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({success: true, data: user});
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (! user) {
        return next(new errorResponse(`User not found with id ${req.params.id}`), 404);
    }

    user.deleteOne();
    res.status(200).json({success: true, data: {} });
});