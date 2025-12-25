const express = require('express');
const router = express.Router();
const {
  createMark,
  getAllMarks,
  getMarksByStudent,
  updateMark,
  deleteMark
} = require('../controllers/markController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllMarks)
  .post(authorize('admin', 'teacher'), createMark);

router.get('/student/:studentId', getMarksByStudent);

router.route('/:id')
  .put(authorize('admin', 'teacher'), updateMark)
  .delete(authorize('admin', 'teacher'), deleteMark);

module.exports = router;