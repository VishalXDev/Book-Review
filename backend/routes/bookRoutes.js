const express = require('express');
const router = express.Router();

const {
  addBook,
  getBooks,
  getBookById,
  deleteBook,
} = require('../controllers/bookController');

const { protect } = require('../middleware/authMiddleware'); // ✅ Fixed

// @route   POST /api/books
// @desc    Add a new book
// @access  Private
router.post('/', protect, addBook);

// @route   GET /api/books
// @desc    Get all books with filters, pagination
// @access  Public
router.get('/', getBooks);

// @route   GET /api/books/:id
// @desc    Get a book by ID
// @access  Public
router.get('/:id', getBookById);

// @route   DELETE /api/books/:id
// @desc    Delete a book by ID (creator only)
// @access  Private
router.delete('/:id', protect, deleteBook);

module.exports = router;
