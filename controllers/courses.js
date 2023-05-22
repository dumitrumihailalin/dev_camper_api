const Course = require("../models/Course");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async');

exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    const reqQuery = { ...req.query};

    let removeFields = ['select', 'sort'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = Course.find(JSON.parse(queryStr));
    
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
    const total = await Course.countDocuments();

    query = query.skip(startIndex).limit(limit);
    const courses = await query;
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
    res.status(200).json({success: true, pagination, count: courses.length, data: courses});
})

exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if ( ! course) {
            return next(new errorResponse(`Course not found with id of ${req.params.id}`), 404);
        }
        res.status(200).json({success: true, data: course});
    } catch (err) {
        next(new errorResponse(`Course not found with id of ${req.params.id}`), 404);
    }
}

exports.createCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.create(req.body);
    if (course) {
        res.status(201).json({success: true, data: course});

    }
    next(new errorResponse(`Failed to create because duplicate field`), 400);    
})

exports.updateCourse = async (req, res, next) => {

    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
    
        if ( ! course) {
            return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`), 404);
        }
        res.status(200).json({success: true, data: course});
    } catch(err) {
        next(new errorResponse(`Failed to update`), 400);
    }
}

exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id)
    
        if ( ! course) {
            return next(new errorResponse(`Course not found with id of ${req.params.id}`), 404);
        }
        res.status(200).json({success: true, data: {} });
    } catch(err) {
        next(new errorResponse(`Failed to delete`), 400);
    }
}