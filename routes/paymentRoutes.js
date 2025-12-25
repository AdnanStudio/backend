const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
  createPaymentRequest,
  getAllPaymentRequests,
  getPaymentRequest,
  submitPaymentProof,
  updatePaymentStatus,
  deletePaymentRequest
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAllPaymentRequests)
  .post(authorize('admin', 'teacher'), createPaymentRequest);

router.route('/:id')
  .get(getPaymentRequest)
  .delete(authorize('admin'), deletePaymentRequest);

router.put('/:id/submit', authorize('student'), upload.single('paymentProof'), submitPaymentProof);
router.put('/:id/status', authorize('admin', 'teacher'), updatePaymentStatus);

module.exports = router;