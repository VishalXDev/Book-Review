import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, form)
      login(res.data.token, res.data.username)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light tracking-widest mb-3">ACCESS</h2>
          <div className="w-12 h-px bg-white mx-auto"></div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 border border-red-900 bg-red-950 bg-opacity-20">
            <p className="text-red-400 text-sm tracking-wide text-center uppercase">
              {error}
            </p>
          </div>
        )}

        {/* Login Form */}
        <div onSubmit={handleSubmit} className="space-y-8">
          {/* Username Field */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-widest text-gray-400">
              IDENTITY
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username or email..."
              value={form.username}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-gray-800 px-4 py-4 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors duration-200 tracking-wide"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-widest text-gray-400">
              CREDENTIAL
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password..."
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-transparent border border-gray-800 px-4 py-4 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors duration-200 tracking-wide"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-4 border transition-all duration-200 text-sm uppercase tracking-widest ${
                loading
                  ? 'border-gray-800 text-gray-600 cursor-not-allowed'
                  : 'border-white bg-white text-black hover:bg-transparent hover:text-white'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-4 h-4 border border-gray-600 border-t-gray-400 rounded-full animate-spin"></div>
                  <span>AUTHENTICATING</span>
                </div>
              ) : (
                'ENTER'
              )}
            </button>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="mt-12 text-center">
          <div className="w-24 h-px bg-gray-800 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage