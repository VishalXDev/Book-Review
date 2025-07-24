// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes (requires valid JWT)
const protect = async (req, res, next) => {
  let token;

  try {
    const authHeader = req.headers.authorization;

    // ✅ Extract token from "Bearer <token>" format
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    // ✅ Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user and attach to request (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  } else {
    return res.status(403).json({ message: 'Only admin can access this route' });
  }
};

module.exports = {
  protect,
  admin,
};
