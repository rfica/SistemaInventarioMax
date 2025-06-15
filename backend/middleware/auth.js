const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  jwt.verify(token, jwtSecret, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    const foundUser = await User.findByPk(user.id);
    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = foundUser;
    next();
  });
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };