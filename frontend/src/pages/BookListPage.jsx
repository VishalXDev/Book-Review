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
  const user = JSON.parse(localStorage.getItem('user'))

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

  // 👉 Delete handler: passed to BookCard
  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`${API_BASE}/api/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      setBooks((prev) => prev.filter((b) => b._id !== bookId))
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete book')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-widest mb-2">LIBRARY</h1>
          <div className="w-16 h-px bg-white"></div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-gray-400">FILTER BY GENRE</label>
            <input
              type="text"
              placeholder="Enter genre..."
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-transparent border border-gray-800 px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-gray-400">FILTER BY AUTHOR</label>
            <input
              type="text"
              placeholder="Enter author..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-transparent border border-gray-800 px-4 py-3 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors duration-200"
            />
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-6 h-6 border border-gray-600 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400 text-sm tracking-wide">LOADING LIBRARY...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-sm tracking-wide uppercase">{error}</p>
          </div>
        )}

        {/* No Books Found */}
        {!loading && books.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="w-16 h-16 border border-gray-800 rounded-sm mx-auto mb-6 flex items-center justify-center text-gray-600">
              <span className="text-2xl">□</span>
            </div>
            <p className="text-gray-400 text-sm tracking-wide uppercase">NO BOOKS FOUND</p>
          </div>
        )}

        {/* Book Grid */}
        <div className="space-y-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onDelete={handleDeleteBook} currentUserId={user?._id} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center space-x-8">
            <button
              className="px-6 py-3 border border-gray-800 text-sm tracking-wide hover:border-white hover:text-white transition-colors duration-200 disabled:opacity-30 disabled:hover:border-gray-800 disabled:hover:text-gray-400"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              PREV
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400 tracking-widest">
                {String(page).padStart(2, '0')}
              </span>
              <div className="w-8 h-px bg-gray-800"></div>
              <span className="text-sm text-gray-600 tracking-widest">
                {String(totalPages).padStart(2, '0')}
              </span>
            </div>

            <button
              className="px-6 py-3 border border-gray-800 text-sm tracking-wide hover:border-white hover:text-white transition-colors duration-200 disabled:opacity-30 disabled:hover:border-gray-800 disabled:hover:text-gray-400"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ✅ Refactored BookCard component with conditional delete
const BookCard = ({ book, onDelete, currentUserId }) => {
  const [avgRating, setAvgRating] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const API_BASE = process.env.REACT_APP_API_BASE_URL

  useEffect(() => {
    const fetchAvg = async () => {
      try {
        const res = await axios.get(`${API_BASE}/reviews/${book._id}`)
        const ratings = res.data.map((r) => r.rating)
        const avg = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null
        setAvgRating(avg)
      } catch (err) {
        console.error('Error fetching average rating')
      }
    }
    fetchAvg()
  }, [book._id])

  const handleDeleteClick = async (e) => {
    e.preventDefault()
    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`)) return
    try {
      setDeleting(true)
      await onDelete(book._id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="relative group">
      <Link to={`/books/${book._id}`}>
        <div className="border border-gray-900 p-6 hover:border-gray-700 transition-all duration-300 hover:bg-gray-950">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-light tracking-wide mb-3 group-hover:text-gray-300 transition-colors duration-200">
                {book.title}
              </h2>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-xs uppercase tracking-widest text-gray-500 w-16">AUTHOR</span>
                  <span className="text-sm text-gray-300">{book.author}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs uppercase tracking-widest text-gray-500 w-16">GENRE</span>
                  <span className="text-sm text-gray-300">{book.genre}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs uppercase tracking-widest text-gray-500 w-16">RATING</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-2 h-2 border ${
                            avgRating && star <= Math.round(avgRating)
                              ? 'bg-white border-white'
                              : 'border-gray-600'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-400 ml-2">
                      {avgRating !== null ? avgRating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delete Button */}
            {book.user === currentUserId && (
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                className="ml-6 w-8 h-8 border border-gray-800 hover:border-red-800 hover:text-red-400 transition-colors duration-200 flex items-center justify-center text-xs disabled:opacity-50"
                title="Delete book"
              >
                {deleting ? '·' : '×'}
              </button>
            )}
          </div>
          
          <div className="w-full h-px bg-gray-900 group-hover:bg-gray-700 transition-colors duration-200"></div>
        </div>
      </Link>
    </div>
  )
}

export default BookListPage