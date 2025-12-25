const express = require('express');
const router = express.Router();
const {
  markAttendance,
  markBulkAttendance,
  getAttendanceByClass,
  getAttendanceByStudent,
  updateAttendance,
  deleteAttendance,
  getAttendanceReport,
  markAllPresent
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Mark attendance routes
router.post('/', authorize('admin', 'teacher'), markAttendance);
router.post('/bulk', authorize('admin', 'teacher'), markBulkAttendance);
router.post('/mark-all-present', authorize('admin', 'teacher'), markAllPresent);

// Get attendance routes
router.get('/class/:classId', getAttendanceByClass);
router.get('/student/:studentId', getAttendanceByStudent);
router.get('/report/:classId', getAttendanceReport);

// Update and delete routes
router.route('/:id')
  .put(authorize('admin', 'teacher'), updateAttendance)
  .delete(authorize('admin'), deleteAttendance);

module.exports = router;