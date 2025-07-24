const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewText: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: Add an index to speed up queries for book reviews
reviewSchema.index({ book: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
