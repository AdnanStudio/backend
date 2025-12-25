const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
  createTeacher,
  getAllTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  getTeachersBySubject,
  toggleTeacherStatus,
  getTeacherProfile
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

// All routes protected
router.use(protect);

// =====================
// Teacher profile (logged-in teacher)
// =====================
router.get('/profile', authorize('teacher'), getTeacherProfile);

// =====================
// Teachers list & create
// =====================
router.route('/')
  .get(getAllTeachers)
  .post(authorize('admin'), upload.single('profileImage'), createTeacher);

// =====================
// Get teachers by subject
// =====================
router.get('/subject/:subjectName', getTeachersBySubject);

// =====================
// Single teacher CRUD
// =====================
router.route('/:id')
  .get(getTeacher)
  .put(authorize('admin'), upload.single('profileImage'), updateTeacher)
  .delete(authorize('admin'), deleteTeacher);

// =====================
// Toggle teacher active status
// =====================
router.put('/:id/status', authorize('admin'), toggleTeacherStatus);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const { upload } = require('../config/cloudinary');
// const {
//   createTeacher,
//   getAllTeachers,
//   getTeacher,
//   updateTeacher,
//   deleteTeacher,
//   getTeachersBySubject,
//   toggleTeacherStatus
// } = require('../controllers/teacherController');
// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);

// router.route('/')
//   .get(getAllTeachers)
//   .post(authorize('admin'), upload.single('profileImage'), createTeacher);

// router.get('/subject/:subjectName', getTeachersBySubject);

// router.route('/:id')
//   .get(getTeacher)
//   .put(authorize('admin'), upload.single('profileImage'), updateTeacher)
//   .delete(authorize('admin'), deleteTeacher);

// router.put('/:id/status', authorize('admin'), toggleTeacherStatus);



// module.exports = router;