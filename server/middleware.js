const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: 'login first' })
  }
  try {
    req.user = jwt.verify(token, process.env.SECRET)
    next()
  } catch (err) {
    res.status(401).json({ message: 'invalid token' })
  }
}

function admin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'only admin allowed' })
  }
  next()
}

module.exports = { auth, admin }
