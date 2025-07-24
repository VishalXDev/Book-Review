const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      index: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      minlength: [2, 'Author must be at least 2 characters'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
      minlength: [2, 'Genre must be at least 2 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual to calculate average rating (async virtuals require usage in code)
bookSchema.virtual('averageRating').get(async function () {
  const reviews = await mongoose.model('Review').find({ book: this._id });
  if (reviews.length === 0) return 0;
  const avg = reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;
  return Number(avg.toFixed(2));
});

module.exports = mongoose.model('Book', bookSchema);
