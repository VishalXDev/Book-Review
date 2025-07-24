import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getLoggedInUser } from '../utils/auth'

const AddBookPage = () => {
  const navigate = useNavigate()
  const user = getLoggedInUser()
  const isAdmin = user?.email === 'admin@admin.com' // Ideally manage roles better

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.author || !formData.genre) {
      setError('Please fill in all fields.')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/books`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      navigate('/')
    } catch (error) {
      setError(error?.response?.data?.message || 'Error adding book')
    } finally {
      setLoading(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Unauthorized</h1>
        <p>Only admin can add books.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Add a Book</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Title
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 border"
            required
          />
        </label>
        <label className="block">
          Author
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Author"
            className="w-full p-2 border"
            required
          />
        </label>
        <label className="block">
          Genre
          <input
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Genre"
            className="w-full p-2 border"
            required
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Adding...' : 'Add Book'}
        </button>
      </form>
    </div>
  )
}

export default AddBookPage
