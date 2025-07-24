const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  try {
    const authHeader = req.headers.authorization;

    // ✅ Step 1: Check if Bearer token is present
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // ❌ If no token, respond unauthorized
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    // ✅ Step 2: Decode and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Step 3: Attach user (excluding password) to request object
    const user = await User.findById(decoded.id).select('-password');

    // ❌ If user not found in DB (deleted account etc.)
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user;
    next(); // ✅ Proceed to the next middleware or controller
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

module.exports = protect;
