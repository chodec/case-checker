const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sessionsMiddleware = require('./middlewares/sessions')
const { verifyToken } = require('./middlewares/auth')

const registerRouter = require('./routes/register')
const validateRouter = require('./routes/validate')
const loginRouter = require('./routes/login')
const steamApi = require('./routes/steamApi')
const insertAsset = require('./routes/insertAsset')
const getUserAssets = require('./routes/getUserAssets')
const countUserAssets = require('./routes/countUserAssets')
const deleteUserAsset = require('./routes/deleteUserAsset')
const portfolioPerformance = require('./routes/portfolioPerformance')

const app = express()
const port = 3000
let fePath = path.join(__dirname, '../')

app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(fePath + '/public'))
app.use(sessionsMiddleware)

app.use(validateRouter)
app.use(registerRouter)
app.use(loginRouter)

app.use('/asset', verifyToken, getUserAssets)
app.use('/asset', verifyToken, countUserAssets)
app.use('/asset', verifyToken, deleteUserAsset)
app.use('/asset', verifyToken, portfolioPerformance)
app.use('/asset', verifyToken, insertAsset)
app.use('/asset', verifyToken, steamApi)

app.get('/dashboard', verifyToken, (req, res) => {
  res.sendFile(path.join(fePath, '/public/html/dashboard.html'))
})

app.get('/', (req, res) => {
  res.sendFile(path.join(fePath, '/public/html/index.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(fePath, '/public/html/login.html'))
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(fePath, '/public/html/register.html'))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
