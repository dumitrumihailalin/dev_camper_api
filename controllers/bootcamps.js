const Bootcamp = require("../models/Bootcamp");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async');

exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query};

    let removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = Bootcamp.find(JSON.parse(queryStr));
    
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 2;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);
    const bootcamps = await query;
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    res.status(200).json({success: true, pagination, count: bootcamps.length, data: bootcamps});
})

exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if ( ! bootcamp) {
            return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`), 404);
        }
        res.status(200).json({success: true, data: bootcamp});
    } catch (err) {
        next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`), 404);
    }
}

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    // Add user to body
    req.body.user = req.user.id;
    const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});

    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new errorResponse(`The user with ID ${req.user.id} has already published`), 400);
    }

    const bootcamp = await Bootcamp.create(req.body);
    
    if (bootcamp) {
        res.status(201).json({success: true, data: bootcamp});

    }
    next(new errorResponse(`Failed to create because duplicate field`), 400);    
})

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (! bootcamp) {
        return next(
            new errorResponse(`Bootcamp not found with id of ${req.parms.id}`), 404
        );
    }
    
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse(`User ${req.params.id} is not authorized`), 401);
    }
   
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({success: true, data: bootcamp});
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (! bootcamp) {
        return next(new errorResponse(`Bootcamp not found with id ${req.params.id}`), 404);
    }
    bootcamp.remove();
    res.status(200).json({success: true, data: {} });
});

exports.bootcampFileUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (! bootcamp) {
        return next(new errorResponse(`Bootcamp not found with id ${req.params.id}`), 404);
    }
    console.log(req.file);
    
    if (!req.files) {
        return next(new errorResponse(`Please upload a file`), 400);
    }

});