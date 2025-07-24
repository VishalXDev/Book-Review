import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const BookDetailPage = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [error, setError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [hoverRating, setHoverRating] = useState(0)

  const API = process.env.REACT_APP_API_BASE_URL
  const token = localStorage.getItem('token')
  const currentUser = JSON.parse(localStorage.getItem('user'))

  const fetchBook = async () => {
    try {
      const { data } = await axios.get(`${API}/api/books/${id}`)
      setBook(data)
    } catch {
      setError('Failed to load book details')
    }
  }

  const fetchReviews = async () => {
    setLoadingReviews(true)
    try {
      const { data } = await axios.get(`${API}/api/reviews/${id}`)
      setReviews(data || [])
    } catch {
      setError('Failed to load reviews')
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!token) return alert('Please login to submit a review')
    if (!newReview.trim()) {
      setSubmitError('Review cannot be empty')
      return
    }

    try {
      await axios.post(
        `${API}/api/reviews/${id}`,
        { rating: newRating, reviewText: newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNewReview('')
      setNewRating(5)
      fetchReviews()
      setSubmitError('')
    } catch {
      setSubmitError('Failed to submit review')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    try {
      await axios.delete(`${API}/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReviews(reviews.filter(r => r._id !== reviewId))
    } catch {
      alert('Failed to delete review')
    }
  }

  useEffect(() => {
    fetchBook()
    fetchReviews()
  }, [id])

  if (error) return <ErrorScreen message={error} />
  if (!book) return <LoadingScreen message="Loading book details..." />

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <BookHeader book={book} reviews={reviews} />

        <ReviewList
          reviews={reviews}
          loading={loadingReviews}
          currentUser={currentUser}
          onDelete={handleDeleteReview}
        />

        <ReviewForm
          newReview={newReview}
          setNewReview={setNewReview}
          newRating={newRating}
          setNewRating={setNewRating}
          hoverRating={hoverRating}
          setHoverRating={setHoverRating}
          onSubmit={handleReviewSubmit}
          error={submitError}
          token={token}
        />
      </div>
    </div>
  )
}

// Sub-components

const StarRating = ({ 
  rating, 
  size = 'md', 
  interactive = false,
  onHover,
  onClick,
  hoverRating 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverRating || rating)
        return (
          <svg
            key={star}
            className={`${sizes[size]} ${
              isFilled ? 'text-yellow-400' : 'text-gray-600'
            } ${interactive ? 'cursor-pointer hover:scale-110' : ''} transition-all`}
            fill={isFilled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 24 24"
            onMouseEnter={interactive ? () => onHover(star) : undefined}
            onMouseLeave={interactive ? () => onHover(0) : undefined}
            onClick={interactive ? () => onClick(star) : undefined}
          >
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )
      })}
    </div>
  )
}

const BookHeader = ({ book, reviews }) => {
  const avgRating = reviews.length 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex justify-center">
        {book.coverImage ? (
          <img 
            src={book.coverImage} 
            alt={`${book.title} cover`} 
            className="h-64 w-auto rounded-lg object-cover shadow-md"
          />
        ) : (
          <div className="h-64 w-48 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">
            No Cover
          </div>
        )}
      </div>

      <div className="md:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{book.title}</h1>
        <p className="text-lg text-gray-300">by {book.author}</p>
        
        <div className="flex items-center space-x-4">
          <StarRating rating={Math.round(avgRating)} size="md" />
          <span className="text-gray-400">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        {book.genre && (
          <div className="flex flex-wrap gap-2 mt-2">
            {book.genre.split(',').map((g, i) => (
              <span 
                key={i} 
                className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
              >
                {g.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const ReviewList = ({ reviews, loading, currentUser, onDelete }) => {
  if (loading) return <LoadingScreen message="Loading reviews..." />
  if (!reviews.length) return (
    <div className="text-center py-12 bg-gray-800 rounded-xl">
      <p className="text-gray-400">No reviews yet. Be the first to review!</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div 
            key={review._id} 
            className="bg-gray-800 rounded-xl p-6 shadow-md relative hover:bg-gray-750 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium">{review.reviewer.username}</p>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <span className="text-sm text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-300 whitespace-pre-line">{review.reviewText}</p>

            {currentUser?._id === review.reviewer._id && (
              <button
                onClick={() => onDelete(review._id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete review"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const ReviewForm = ({ 
  newReview, 
  setNewReview, 
  newRating, 
  setNewRating, 
  hoverRating,
  setHoverRating,
  onSubmit, 
  error,
  token
}) => {
  if (!token) return (
    <div className="bg-gray-800 rounded-xl p-6 text-center">
      <p className="text-gray-400">
        Please <a href="/login" className="text-blue-400 hover:underline">login</a> to submit a review
      </p>
    </div>
  )

  return (
    <form onSubmit={onSubmit} className="bg-gray-800 rounded-xl p-6 space-y-6 shadow-lg">
      <h3 className="text-xl font-semibold">Write a Review</h3>
      
      {error && (
        <div className="p-3 bg-red-900 bg-opacity-30 rounded-lg text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Your Rating</label>
        <StarRating 
          rating={newRating} 
          hoverRating={hoverRating}
          onHover={setHoverRating}
          onClick={setNewRating}
          interactive={true}
          size="lg"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="review" className="block text-sm font-medium text-gray-300">
          Your Review
        </label>
        <textarea
          id="review"
          rows={5}
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg p-4 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Share your thoughts about this book..."
        />
      </div>

      <button
        type="submit"
        disabled={!newReview.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Review
      </button>
    </form>
  )
}

const LoadingScreen = ({ message }) => (
  <div className="flex justify-center items-center py-20 space-x-3">
    <div className="w-5 h-5 border-2 border-gray-500 border-t-blue-400 rounded-full animate-spin" />
    <span className="text-gray-400">{message}</span>
  </div>
)

const ErrorScreen = ({ message }) => (
  <div className="flex justify-center items-center py-20">
    <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-6 max-w-md text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-red-300">{message}</p>
    </div>
  </div>
)

export default BookDetailPage
