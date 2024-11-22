const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'No token provided or invalid format' })
  }

  const token = authHeader.split(' ')[1] // Extract the token after "Bearer "

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err)
      return res.status(403).json({ message: 'Invalid token' })
    }

    req.user = decoded // Attach decoded user info if needed
    next()
  })
}

module.exports = { verifyToken }
