const express = require('express')
const path = require('path')
const cors = require('cors')

const sessionsMiddleware = require('./middlewares/sessions.js')

const registerRouter = require('./routes/register.js')
const validateRouter = require('./routes/validate.js')
const loginRouter = require('./routes/login.js')
const steamApi = require('./routes/steamApi.js')
const insertAsset = require('./routes/insertAsset.js')
const getUserAssets = require('./routes/getUserAssets.js')
const countUserAssets = require('./routes/countUserAssets.js')
const session = require('express-session')

const app = express()
const port = 3000

let fePath = path.join(__dirname, '../')

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(fePath + '/public'))

app.use(sessionsMiddleware)

app.use(validateRouter)
app.use(registerRouter)
app.use(loginRouter)
app.use(steamApi)
app.use(insertAsset)
app.use(getUserAssets)
app.use(countUserAssets)


const requireAuth = (req, res, next) => {
  if (req.session.userId) {
      next()
  } else {
      res.sendFile(path.join(fePath,'/public/html/login.html'))
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(fePath,'/public/html/index.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(fePath,'/public/html/login.html'))
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(fePath,'/public/html/register.html'))
})

app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(fePath,'/public/html/dashboard.html')) 
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
