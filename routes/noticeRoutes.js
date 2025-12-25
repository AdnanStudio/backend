const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
  createNotice,
  getAllNotices,
  getNotice,
  updateNotice,
  deleteNotice,
  deleteAttachment,
  getPublicNotices
} = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');

// Public routes (no authentication required)
router.get('/public', getPublicNotices); // For PublicHome.js
router.get('/public/:id', getNotice);

// Protected routes (authentication required)
router.use(protect);

router.route('/')
  .get(getAllNotices)
  .post(authorize('admin', 'teacher'), upload.array('attachments', 5), createNotice);

router.route('/:id')
  .get(getNotice)
  .put(authorize('admin', 'teacher'), upload.array('attachments', 5), updateNotice)
  .delete(authorize('admin', 'teacher'), deleteNotice);

router.delete('/:id/attachments/:attachmentId', authorize('admin', 'teacher'), deleteAttachment);

module.exports = router;