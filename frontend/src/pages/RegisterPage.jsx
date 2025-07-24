import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldFocus, setFieldFocus] = useState({})
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
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, form)
      login(res.data.token, res.data.username)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' }
    if (password.length < 6) return { strength: 1, text: 'WEAK', color: 'text-red-400' }
    if (password.length < 8) return { strength: 2, text: 'FAIR', color: 'text-yellow-400' }
    if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { strength: 4, text: 'STRONG', color: 'text-green-400' }
    }
    return { strength: 3, text: 'GOOD', color: 'text-blue-400' }
  }

  const passwordStrength = getPasswordStrength(form.password)

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-500 hover:text-white mb-8 transition-colors duration-200 text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          RETURN
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light tracking-widest mb-3">REGISTRATION</h2>
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

        {/* Register Form */}
        <div className="space-y-8">
          {/* Username Field */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-widest text-gray-400">
              USERNAME
            </label>
            <div className="relative group">
              <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                fieldFocus.username ? 'text-white' : 'text-gray-600'
              }`} />
              <input
                type="text"
                name="username"
                placeholder="Choose username..."
                value={form.username}
                onChange={handleChange}
                onFocus={() => setFieldFocus({...fieldFocus, username: true})}
                onBlur={() => setFieldFocus({...fieldFocus, username: false})}
                required
                className="w-full bg-transparent border border-gray-800 pl-10 pr-4 py-4 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors duration-200 tracking-wide"
              />
              {form.username.length >= 3 && (
                <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
              )}
            </div>
            {form.username.length > 0 && form.username.length < 3 && (
              <p className="text-red-400 text-xs tracking-widest uppercase">MINIMUM 3 CHARACTERS</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-widest text-gray-400">
              EMAIL
            </label>
            <div className="relative group">
              <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                fieldFocus.email ? 'text-white' : 'text-gray-600'
              }`} />
              <input
                type="email"
                name="email"
                placeholder="Your email address..."
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFieldFocus({...fieldFocus, email: true})}
                onBlur={() => setFieldFocus({...fieldFocus, email: false})}
                required
                className="w-full bg-transparent border border-gray-800 pl-10 pr-4 py-4 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors duration-200 tracking-wide"
              />
              {form.email.includes('@') && form.email.includes('.') && (
                <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-widest text-gray-400">
              PASSWORD
            </label>
            <div className="relative group">
              <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                fieldFocus.password ? 'text-white' : 'text-gray-600'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create password..."
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFieldFocus({...fieldFocus, password: true})}
                onBlur={() => setFieldFocus({...fieldFocus, password: false})}
                required
                className="w-full bg-transparent border border-gray-800 pl-10 pr-12 py-4 text-white placeholder-gray-600 focus:border-white focus:outline-none transition-colors duration-200 tracking-wide"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {form.password.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-gray-400">STRENGTH:</span>
                  <span className={`text-xs uppercase tracking-widest ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      passwordStrength.strength === 1 ? 'bg-red-500 w-1/4' :
                      passwordStrength.strength === 2 ? 'bg-yellow-500 w-2/4' :
                      passwordStrength.strength === 3 ? 'bg-blue-500 w-3/4' :
                      passwordStrength.strength === 4 ? 'bg-green-500 w-full' : 'w-0'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
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
                  <span>PROCESSING</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <UserPlus className="w-4 h-4" />
                  <span>REGISTER</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center">
          <div className="w-24 h-px bg-gray-800 mx-auto mb-6"></div>
          <p className="text-gray-500 text-sm uppercase tracking-widest">
            EXISTING USER?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-white hover:text-gray-300 transition-colors duration-200"
            >
              LOGIN HERE
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage