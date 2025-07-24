// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? 'https://your-backend.vercel.app' // replace with deployed backend
    : 'http://localhost:5000',
  withCredentials: true, // if needed for cookies
});

export default api;
