const express = require('express')
const path = require('path')
const cors = require('cors')
const sessionsMiddleware = require('./middlewares/sessions.js')
const { verifyToken } = require('./middlewares/auth')

// Importing routes
const registerRouter = require('./routes/register.js')
const validateRouter = require('./routes/validate.js')
const loginRouter = require('./routes/login.js')
const steamApi = require('./routes/steamApi.js')
const insertAsset = require('./routes/insertAsset.js')
const getUserAssets = require('./routes/getUserAssets.js')
const countUserAssets = require('./routes/countUserAssets.js')
const deleteUserAsset = require('./routes/deleteUserAsset.js')
const portfolioPerformance = require('./routes/portfolioPerformance.js')

const app = express()
const port = 3000

let fePath = path.join(__dirname, '../')

// Middleware setup
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(fePath + '/public'))

app.use(sessionsMiddleware)

// Unprotected routes
app.use(validateRouter)
app.use(registerRouter)
app.use(loginRouter)

// Protected routes with verifyToken middleware
app.use('/asset', verifyToken, getUserAssets)
app.use('/asset', verifyToken, countUserAssets)
app.use('/asset', verifyToken, deleteUserAsset)
app.use('/asset', verifyToken, portfolioPerformance)
app.use('/asset', verifyToken, insertAsset)

// Secure the dashboard route with verifyToken
app.get('/dashboard', verifyToken, (req, res) => {
  res.sendFile(path.join(fePath, '/public/html/dashboard.html'))
})

// Other routes
app.get('/', (req, res) => {
  res.sendFile(path.join(fePath, '/public/html/index.html'))
})
app.get('/login', (req, res) => {
  res.sendFile(path.join(fePath, '/public/html/login.html'))
})
app.get('/register', (req, res) => {
  res.sendFile(path.join(fePath, '/public/html/register.html'))
})

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
