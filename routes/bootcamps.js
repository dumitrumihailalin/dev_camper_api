const express = require('express');
const { 
    getBootcamps, 
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp
} = require('../controllers/bootcamps');
const courseRouter = require('./courses');

const router = express.Router();
router.use('/:bootcampId/courses', courseRouter);

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, authorize('publisher', 'admin'), getBootcamps).post(protect, createBootcamp);
router.route('/:id').get(getBootcamp).put(protect, authorize('publisher', 'admin'), updateBootcamp).delete(deleteBootcamp);
module.exports = router;