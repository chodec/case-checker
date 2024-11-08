const express = require('express')
const path = require('path')
const cors = require('cors')
const sessionsMiddleware = require('./middlewares/sessions.js')
const { verifyToken } = require('./middlewares/auth')

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

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(fePath + '/public'))

app.use(sessionsMiddleware)

app.use(validateRouter)
app.use(registerRouter)
app.use(loginRouter)

app.use('/asset/insert', verifyToken, insertAsset)
app.use('/asset/getUserAssets', verifyToken, getUserAssets)
app.use('/asset/countUserAssets', verifyToken, countUserAssets)
app.use('/asset/delete', verifyToken, deleteUserAsset)
app.use('/asset/portfolioPerformance', verifyToken, portfolioPerformance)

app.get('/', (req, res) => {
  res.sendFile(path.join(fePath, '/public/html/index.html'))
})
app.get('/login', (req, res) => {
  res.sendFile(path.join(fePath, '/public/html/login.html'))
})
app.get('/register', (req, res) => {
  res.sendFile(path.join(fePath, '/public/html/register.html'))
})
app.get('/dashboard', verifyToken, (req, res) => { // Protected route
  res.sendFile(path.join(fePath, '/public/html/dashboard.html'))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
