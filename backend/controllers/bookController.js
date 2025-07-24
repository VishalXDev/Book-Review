const Book = require('../models/Book');
const Review = require('../models/Review');

// ➕ Add a new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const book = await Book.create({ title, author, genre, createdBy: req.user._id });
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add book', error: err.message });
  }
};

// 📚 Get all books with optional filters + pagination
exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 5, genre, author } = req.query;
    const query = {};
    if (genre) query.genre = genre;
    if (author) query.author = author;

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const count = await Book.countDocuments(query);

    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const reviews = await Review.find({ book: book._id });
        const avgRating =
          reviews.length === 0
            ? 0
            : reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;

        return {
          ...book.toObject(),
          averageRating: Number(avgRating.toFixed(2)),
        };
      })
    );

    res.json({
      books: booksWithRatings,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
};

// 📘 Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ book: book._id });
    const avgRating =
      reviews.length === 0
        ? 0
        : reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length;

    res.json({
      ...book.toObject(),
      averageRating: Number(avgRating.toFixed(2)),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching book', error: err.message });
  }
};

// ❌ Delete a book (only creator can)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('createdBy');
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // ✅ Debug logs to compare creator and logged-in user
    console.log('🟡 Book Created By:', book.createdBy._id.toString());
    console.log('🔵 Logged-in User:', req.user._id.toString());

    if (book.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    await book.remove();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
