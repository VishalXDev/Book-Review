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

  const API_BASE = process.env.REACT_APP_API_BASE_URL

  const fetchBook = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/books/${id}`)
      setBook(res.data)
    } catch (err) {
      setError('Error fetching book details')
      console.error(err)
    }
  }

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true)
      const res = await axios.get(`${API_BASE}/api/reviews/${id}`)
      setReviews(res.data || [])
    } catch (err) {
      setError('Error fetching reviews')
      console.error(err)
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please log in to add a review')
      return
    }

    if (!newReview.trim()) {
      setSubmitError('Review text is required')
      return
    }

    try {
      await axios.post(
        `${API_BASE}/api/reviews/${id}`,
        { rating: newRating, reviewText: newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNewReview('')
      setNewRating(5)
      fetchReviews()
    } catch (err) {
      setSubmitError('Failed to submit review')
      console.error(err)
    }
  }

  useEffect(() => {
    fetchBook()
    fetchReviews()
  }, [id])

  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!book) return <div className="p-6">Loading book...</div>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
      <p className="text-gray-700 mb-2">By {book.author}</p>
      <p className="text-sm text-gray-600 mb-4">Genre: {book.genre || 'Unknown'}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">⭐ Reviews</h2>
      {loadingReviews ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="border p-3 mb-3 rounded shadow">
            <div className="text-yellow-500" aria-label={`Rating: ${review.rating}`}>
              Rating: {'⭐'.repeat(review.rating)}
            </div>
            <p className="text-gray-800 mt-1">{review.reviewText}</p>
            <p className="text-xs text-gray-500 mt-1">
              — {review.reviewer?.username || 'Anonymous'}
            </p>
          </div>
        ))
      )}

      <form onSubmit={handleReviewSubmit} className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">➕ Add a Review</h3>

        {submitError && <p className="text-red-600 mb-2">{submitError}</p>}

        <label className="block mb-2">
          Rating:
          <select
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
            className="ml-2 border px-2 py-1"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <textarea
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          rows="3"
          className="w-full border p-2 mb-2"
          placeholder="Write your review..."
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>
    </div>
  )
}

export default BookDetailPage
