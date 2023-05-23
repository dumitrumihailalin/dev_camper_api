const express = require('express');
const { 
    getCourses, 
    getCourse, 
    createCourse, 
    updateCourse, 
    deleteCourse
} = require('../controllers/courses');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
      .get(getCourses)
      .post(protect, authorize('admin', 'publisher'), createCourse);
router.route('/:id')
      .get(getCourse)
      .put(updateCourse)
      .delete(deleteCourse);

module.exports = router;