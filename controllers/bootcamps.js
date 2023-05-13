exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show all bootcamps'});
}

exports.getBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show bootcamp'});
}

exports.createBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Create bootcamp'});
}

exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Update bootcamp'});
}

exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Delete bootcamp'});
}