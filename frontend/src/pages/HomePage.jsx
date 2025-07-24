import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [sortOrder, setSortOrder] = useState('none')
  const [page, setPage] = useState(1)

  const booksPerPage = 5
  const API_BASE = process.env.REACT_APP_API_BASE_URL

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/books`)
      setBooks(res.data.books || res.data) // Depending on backend response
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  useEffect(() => {
    let filtered = [...books]

    if (search) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.author.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (genre) {
      filtered = filtered.filter((b) => b.genre === genre)
    }

    if (sortOrder === 'asc') {
      filtered.sort(
        (a, b) =>
          (a.reviews?.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length || 0) -
          (b.reviews?.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length || 0)
      )
    } else if (sortOrder === 'desc') {
      filtered.sort(
        (a, b) =>
          (b.reviews?.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length || 0) -
          (a.reviews?.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length || 0)
      )
    }

    setFilteredBooks(filtered)
    setPage(1) // Reset to first page on filter/sort changes
  }, [books, search, genre, sortOrder])

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const paginatedBooks = filteredBooks.slice(
    (page - 1) * booksPerPage,
    page * booksPerPage
  )

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Books</h1>

      {/* Search + Filter + Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Genres</option>
          {[...new Set(books.map((b) => b.genre))].map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="none">Sort by Rating</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Books List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedBooks.map((book) => (
          <Link
            to={`/books/${book._id}`}
            key={book._id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p>✍️ {book.author}</p>
            <p>🏷️ {book.genre}</p>
            <p>
              ⭐{' '}
              {book.reviews?.length > 0
                ? (
                    book.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    book.reviews.length
                  ).toFixed(1)
                : 'N/A'}
            </p>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              page === i + 1 ? 'bg-blue-600 text-white' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default HomePage
