const Bootcamp = require("../models/Bootcamp");
const errorResponse = require("../utils/errorResponse");
const asyncHandler = require('../middleware/async');
const path = require('path');

exports.getBootcamps = asyncHandler(async (req, res, next) => {
   res.status(200).json(res.advancedResults);
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
    
    if (!req.files) {
        return next(new errorResponse(`Please upload a file`), 400);
    }
    const file = req.files.file;
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(
                new errorResponse(`Issues with file upload`, 500)
            );
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({
            success: true,
            data: file.name
        });
    })
});