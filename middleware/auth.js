const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) 
        token = req.headers.authorization.split(' ')[1];

    if ( ! token ) {
        return next(new errorResponse('Not authorized to access this route', 401));
    } 

    try {
        // Verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id);
        next();
    } catch(err) {
        console.error(err)
    }
})

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if ( ! roles.includes(req.user.role)) {
            return next(new errorResponse(`User role ${req.user.role} is not authorized to access this API`, 403)); 
        }
        next();
    }
}