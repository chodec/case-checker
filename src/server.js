const express = require('express')
const path = require('path')
const sessionsMiddleware = require('./middlewares/sessions.js')
const registerRouter = require('./middlewares/register.js')
const validateRouter = require('./middlewares/validate.js')
const loginRouter = require('./middlewares/login.js')

const app = express()
const port = 3000

let fePath = path.join(__dirname, '../')

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(fePath + '/public'))

//Setup session
app.use(sessionsMiddleware)
app.use(validateRouter)
app.use(registerRouter)
app.use(loginRouter)

//Check user session
const requireAuth = (req, res, next) => {
  console.log(req.session.userId)
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

app.get('/dashboard', (req, res) => {
  console.log(req.session)
  res.sendFile(path.join(fePath,'/public/html/dashboard.html'))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
