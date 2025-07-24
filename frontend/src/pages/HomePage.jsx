import { useEffect, useState } from 'react'
import { Search, Filter, Star, Book, User, Tag, ChevronLeft, ChevronRight } from 'lucide-react'

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
      // Simulate API call with sample data for demo
      const sampleBooks = [
        { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic Fiction', reviews: [{rating: 4}, {rating: 5}, {rating: 4}] },
        { _id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic Fiction', reviews: [{rating: 5}, {rating: 5}] },
        { _id: '3', title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Classic Fiction', reviews: [{rating: 3}, {rating: 4}] },
        { _id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', reviews: [{rating: 5}, {rating: 4}, {rating: 5}] },
        { _id: '5', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', reviews: [{rating: 5}] },
        { _id: '6', title: '1984', author: 'George Orwell', genre: 'Dystopian Fiction', reviews: [{rating: 4}, {rating: 5}] },
        { _id: '7', title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', genre: 'Fantasy', reviews: [{rating: 5}, {rating: 4}] },
        { _id: '8', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', reviews: [{rating: 5}, {rating: 5}, {rating: 4}] }
      ]
      setBooks(sampleBooks)
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
          (a.reviews?.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length || 0)
      )
    }

    setFilteredBooks(filtered)
    setPage(1)
  }, [books, search, genre, sortOrder])

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const paginatedBooks = filteredBooks.slice(
    (page - 1) * booksPerPage,
    page * booksPerPage
  )

  const getStarRating = (book) => {
    if (!book.reviews?.length) return 0
    return (book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length)
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />)
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />)
      }
    }
    return stars
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Books
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our curated collection of literary masterpieces and find your next favorite read
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="flex flex-wrap gap-6 items-center justify-center">
            {/* Search Input */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-80 border-2 border-gray-200 rounded-xl bg-white/90 focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>

            {/* Genre Filter */}
            <div className="relative group">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl bg-white/90 focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer appearance-none"
              >
                <option value="">All Genres</option>
                {[...new Set(books.map((b) => b.genre))].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Sort Order */}
            <div className="relative group">
              <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl bg-white/90 focus:border-blue-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer appearance-none"
              >
                <option value="none">Sort by Rating</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Active Filters Display */}
          {(search || genre || sortOrder !== 'none') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {search && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Search: "{search}"
                  </span>
                )}
                {genre && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    Genre: {genre}
                  </span>
                )}
                {sortOrder !== 'none' && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Sort: {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 text-center">
            Showing {paginatedBooks.length} of {filteredBooks.length} books
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {paginatedBooks.map((book, index) => {
            const rating = getStarRating(book)
            return (
              <div
                key={book._id}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 overflow-hidden cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  {/* Book Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {book.title}
                      </h2>
                    </div>
                    <div className="ml-4 p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                      <Book className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <User className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">{book.author}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Tag className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-sm font-medium">
                        {book.genre}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(rating)}
                        </div>
                        <span className="text-gray-600 font-medium">
                          {rating > 0 ? rating.toFixed(1) : 'N/A'}
                        </span>
                        {book.reviews?.length > 0 && (
                          <span className="text-gray-400 text-sm ml-2">
                            ({book.reviews.length} review{book.reviews.length !== 1 ? 's' : ''})
                          </span>
                        )}
                      </div>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium">
                          View Details
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {paginatedBooks.length === 0 && (
          <div className="text-center py-16">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border-2 border-gray-200 bg-white/80 hover:bg-white hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1
                const isActive = page === pageNum
                const isNear = Math.abs(pageNum - page) <= 1
                const isFirst = pageNum === 1
                const isLast = pageNum === totalPages
                
                if (isNear || isFirst || isLast) {
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'bg-white/80 text-gray-700 border-2 border-gray-200 hover:bg-white hover:border-blue-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                } else if (Math.abs(pageNum - page) === 2) {
                  return (
                    <span key={i} className="px-2 py-2 text-gray-400">
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border-2 border-gray-200 bg-white/80 hover:bg-white hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage