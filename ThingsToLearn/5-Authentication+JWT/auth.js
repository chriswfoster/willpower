// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================
// This file contains middleware to verify JWT tokens
// and protect routes from unauthorized access

const jwt = require('jsonwebtoken');

// SECRET KEY for signing and verifying JWT tokens
// In production, this should be in an environment variable (.env file)
// NEVER commit this to Git in a real application!
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// ============================================
// VERIFY JWT TOKEN MIDDLEWARE
// ============================================
// This middleware function checks if a request has a valid JWT token
// It runs BEFORE protected route handlers

function verifyToken(req, res, next) {
  // JWT tokens are typically sent in the Authorization header
  // Format: "Authorization: Bearer <token>"

  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check if the header exists
  if (!authHeader) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No token provided. Please login first.'
    });
  }

  // Extract the token from the header
  // authHeader format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  // We want just the token part (after "Bearer ")
  const token = authHeader.split(' ')[1]; // Split by space, take second part

  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'Invalid token format. Use: Bearer <token>'
    });
  }

  try {
    // jwt.verify() checks if the token is valid
    // It verifies:
    // 1. The signature is correct (token wasn't tampered with)
    // 2. The token hasn't expired
    // 3. The token was signed with our secret key

    const decoded = jwt.verify(token, JWT_SECRET);

    // decoded contains the payload we put in the token
    // Example: { userId: 1, username: 'alice', iat: 1234567890 }

    // Add the user info to the request object
    // Now our route handlers can access req.user
    req.user = decoded;

    // Call next() to pass control to the route handler
    next();
  } catch (error) {
    // If verification fails, the token is invalid or expired
    console.error('Token verification failed:', error.message);

    return res.status(401).json({
      error: 'Invalid token',
      message: 'Token is invalid or expired. Please login again.'
    });
  }
}

// ============================================
// EXPORT
// ============================================
module.exports = {
  JWT_SECRET,
  verifyToken
};
