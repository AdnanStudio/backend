const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadBookImage } = require('../config/cloudinary');
const {
  getAllBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  issueBook,
  returnBook,
  getAllIssues,
  getAllFines,
  updateFineStatus,
  getLibraryStats
} = require('../controllers/libraryController');

// Protect all routes
router.use(protect);

// Book Routes (Admin & Librarian only)
router.route('/books')
  .get(authorize('admin', 'librarian'), getAllBooks)
  .post(authorize('admin', 'librarian'), uploadBookImage.single('bookImage'), createBook);

router.route('/books/:id')
  .get(authorize('admin', 'librarian'), getBook)
  .put(authorize('admin', 'librarian'), uploadBookImage.single('bookImage'), updateBook)
  .delete(authorize('admin', 'librarian'), deleteBook);

// Issue/Return Routes (Admin & Librarian only)
router.post('/issue', authorize('admin', 'librarian'), issueBook);
router.put('/return/:issueId', authorize('admin', 'librarian'), returnBook);
router.get('/issues', authorize('admin', 'librarian'), getAllIssues);

// Fine Routes (Admin & Librarian only)
router.get('/fines', authorize('admin', 'librarian'), getAllFines);
router.put('/fines/:fineId', authorize('admin', 'librarian'), updateFineStatus);

// Statistics Route (Admin & Librarian only)
router.get('/stats', authorize('admin', 'librarian'), getLibraryStats);

module.exports = router;