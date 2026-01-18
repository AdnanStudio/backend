const express = require('express');
const router = express.Router();
const {
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  toggleTeacherStatus
} = require('../controllers/teacherListController');
const { protect, isAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getAllTeachers);
router.get('/:id', getTeacher);

// Protected routes (Admin only)
router.use(protect);
router.use(isAdmin);

router.post('/', upload.single('image'), createTeacher);
router.put('/:id', upload.single('image'), updateTeacher);
router.delete('/:id', deleteTeacher);
router.put('/:id/status', toggleTeacherStatus);

module.exports = router;