const express = require('express');
const router = express.Router();

const {
  addReview,
  getReviewsByBook,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/reviews/:bookId
// @desc    Add a review to a book
// @access  Private
router.post('/:bookId', protect, addReview);

// @route   GET /api/reviews/:bookId
// @desc    Get all reviews for a book
// @access  Public
router.get('/:bookId', getReviewsByBook);

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review by ID (only by reviewer)
// @access  Private
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
