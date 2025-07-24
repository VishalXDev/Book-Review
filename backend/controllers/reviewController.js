const Book = require('../models/Book');
const Review = require('../models/Review');

// 📝 Add Review to a Book
exports.addReview = async (req, res) => {
  try {
    const { reviewText, rating } = req.body;

    if (!reviewText || !rating) {
      return res.status(400).json({ message: 'Review text and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const review = await Review.create({
      reviewText,
      rating,
      reviewer: req.user._id,
      book: book._id,
    });

    // Add review to book's reviews array
    book.reviews.push(review._id);
    await book.save();

    // Calculate new average rating
    const reviews = await Review.find({ book: book._id });
    const avgRating =
      reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;

    res.status(201).json({
      review,
      averageRating: Number(avgRating.toFixed(2)),
    });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add review', error: err.message });
  }
};

// 📚 Get All Reviews for a Book
exports.getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate(
      'reviewer',
      'username'
    );
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// ❌ Delete a Review by the Logged-in Reviewer
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    await Book.findByIdAndUpdate(review.book, {
      $pull: { reviews: review._id },
    });

    // Recalculate average rating
    const reviews = await Review.find({ book: review.book });
    const avgRating =
      reviews.length === 0
        ? 0
        : reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;

    res.json({
      message: 'Review deleted successfully',
      averageRating: Number(avgRating.toFixed(2)),
    });
  } catch (err) {
    res.status(500).json({ message: 'Delete review failed', error: err.message });
  }
};
