import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

// Debounce input for filter
const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

const BookListPage = () => {
  const [books, setBooks] = useState([])
  const [genre, setGenre] = useState('')
  const [author, setAuthor] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const debouncedGenre = useDebounce(genre)
  const debouncedAuthor = useDebounce(author)

  const API_BASE = process.env.REACT_APP_API_BASE_URL

  const fetchBooks = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${API_BASE}/api/books`, {
        params: { genre: debouncedGenre, author: debouncedAuthor, page, limit: 5 },
      })
      setBooks(res.data.books)
      setTotalPages(res.data.totalPages || 1)
    } catch (err) {
      setError('Failed to load books. Please try again.')
      console.error('Error fetching books', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [debouncedGenre, debouncedAuthor, page])

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📚 Book List</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border px-2 py-1"
        />
        <input
          type="text"
          placeholder="Filter by Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border px-2 py-1"
        />
      </div>

      {/* Loading / Error */}
      {loading && <p>Loading books...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Book Cards */}
      {!loading && books.length === 0 && <p>No books found.</p>}
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          className="px-4 py-1 border rounded"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          ⬅ Prev
        </button>
        <span className="px-4 py-1">
          {page} / {totalPages}
        </span>
        <button
          className="px-4 py-1 border rounded"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next ➡
        </button>
      </div>
    </div>
  )
}

const BookCard = ({ book }) => {
  const [avgRating, setAvgRating] = useState(null)
  const API_BASE = process.env.REACT_APP_API_BASE_URL

  useEffect(() => {
    const fetchAvg = async () => {
      try {
        // NOTE: backend needs averageRating endpoint; otherwise compute client-side or remove
        const res = await axios.get(`${API_BASE}/reviews/${book._id}`)
        const ratings = res.data.map((r) => r.rating)
        const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null
        setAvgRating(avg)
      } catch (err) {
        console.error('Error fetching average rating')
      }
    }
    fetchAvg()
  }, [book._id, API_BASE])

  return (
    <Link to={`/books/${book._id}`} className="block mb-4 p-4 border rounded shadow hover:bg-gray-50">
      <h2 className="text-xl font-semibold">{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Genre: {book.genre}</p>
      <p>⭐ Average Rating: {avgRating !== null ? avgRating.toFixed(1) : 'N/A'}</p>
    </Link>
  )
}

export default BookListPage
