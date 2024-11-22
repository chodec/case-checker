const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader
    ? authHeader.split(' ')[1]
    : req.cookies.token

  if (!token) {
    return res.status(403).json({ message: 'No token provided or invalid format' })
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err)
      return res.status(403).json({ message: 'Invalid token' })
    }

    req.user = decoded
    next()
  })
}

module.exports = { verifyToken }
