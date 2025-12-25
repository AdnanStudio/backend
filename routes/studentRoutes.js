const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
  createStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass,
  toggleStudentStatus,
  getStudentProfile // <-- নিশ্চিত হও controller এ ফাংশন আছে
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Admin and Teacher can create, view students
router.route('/')
  .get(getAllStudents)
  .post(authorize('admin', 'teacher'), upload.single('profileImage'), createStudent);

// Get students by class
router.get('/class/:className/:section', getStudentsByClass);

// Single student operations
router.route('/:id')
  .get(getStudent)
  .put(authorize('admin', 'teacher'), upload.single('profileImage'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

// Toggle student status (activate/deactivate)
router.put('/:id/status', authorize('admin'), toggleStudentStatus);

// Student own profile
router.get('/profile', authorize('student'), getStudentProfile);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { upload } = require('../config/cloudinary');
// const {
//   createStudent,
//   getAllStudents,
//   getStudent,
//   updateStudent,
//   deleteStudent,
//   getStudentsByClass,
//   toggleStudentStatus
// } = require('../controllers/studentController');
// const { protect, authorize } = require('../middleware/auth');

// // All routes are protected
// router.use(protect);

// // Admin and Teacher can create, view students
// router.route('/')
//   .get(getAllStudents)
//   .post(authorize('admin', 'teacher'), upload.single('profileImage'), createStudent);

// // Get students by class
// router.get('/class/:className/:section', getStudentsByClass);

// // Single student operations
// router.route('/:id')
//   .get(getStudent)
//   .put(authorize('admin', 'teacher'), upload.single('profileImage'), updateStudent)
//   .delete(authorize('admin'), deleteStudent);

// // Toggle student status (activate/deactivate)
// router.put('/:id/status', authorize('admin'), toggleStudentStatus);

// module.exports = router;