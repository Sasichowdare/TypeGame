const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../controllers/authController'); // Import blacklist check

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Authorization token required' });
  }

  if (isTokenBlacklisted(token)) {
    return res.status(403).json({ error: 'Token is invalid (logged out)' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userId = decoded.id; 
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
