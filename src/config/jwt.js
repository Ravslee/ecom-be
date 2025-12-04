module.exports = {
  secret: process.env.JWT_SECRET || 'devsecret',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};
