const express = require('express');
const router = express.Router();
const {
  getAllTrainings,
  getTraining,
  createTraining,
  updateTraining,
  deleteTraining,
  toggleTrainingStatus
} = require('../controllers/teacherTrainingController');
const { protect, isAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', getAllTrainings);
router.get('/:id', getTraining);

// Protected routes (Admin only)
router.use(protect);
router.use(isAdmin);

router.post('/', upload.single('image'), createTraining);
router.put('/:id', upload.single('image'), updateTraining);
router.delete('/:id', deleteTraining);
router.put('/:id/status', toggleTrainingStatus);

module.exports = router;