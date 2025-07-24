import {jwtDecode} from 'jwt-decode'

/**
 * Decode JWT from localStorage and return payload if valid.
 * Removes token if expired or invalid.
 * 
 * @returns {object|null} Decoded JWT payload or null if no valid token
 */
export const getLoggedInUser = () => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const decoded = jwtDecode(token)

    // Check if token expired (exp in seconds)
    const currentTime = Date.now() / 1000
    if (decoded?.exp && decoded.exp < currentTime) {
      console.warn('Token expired. Clearing token from storage.')
      localStorage.removeItem('token')
      return null
    }

    return decoded
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    localStorage.removeItem('token')
    return null
  }
}
