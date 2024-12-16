const jwt = require('jsonwebtoken');

// JWT secret key (use your .env file for security)
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const authenticateToken = (req, res, next) => {
  // Get token from headers
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach the decoded user info to the request
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;
