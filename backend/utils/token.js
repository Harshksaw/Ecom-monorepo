// ===================== utils/token.js =====================
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user authentication
 * @param {Object} user - User object with id, email, and role
 * @param {string} expiresIn - Token expiration time (default: '24h')
 * @returns {string} JWT token
 */
exports.generateToken = (user, expiresIn = '24h') => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload or null if invalid
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Generate refresh token with longer expiration
 * @param {Object} user - User object with id
 * @param {string} expiresIn - Token expiration time (default: '7d')
 * @returns {string} Refresh token
 */
exports.generateRefreshToken = (user, expiresIn = '7d') => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn }
  );
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object} Decoded token payload or null if invalid
 */
exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};