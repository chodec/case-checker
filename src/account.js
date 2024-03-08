const express = require('express')
const bcrypt = require('bcrypt')
const { v4: uuidv4} = require('uuid')
const session = require('express-session')
const path = require('path')
const { insertUser, getUser, validateDuplicate, saveSess, getSess, deleteSess } = require('./query.js')
require('dotenv').config()

let duplicate = true

const app = express()
const port = 3000

const saltRounds = 10

let fePath = path.join(__dirname, '../')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static(fePath + '/public'))


//Setup session for DB
app.use(session({
  genid: (req) => {
    return  uuidv4()
  },
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true, 
    maxAge: 60000 * 60 * 24 * 28
  }
}))

//Check user session
const requireAuth = (req, res, next) => {
  console.log(req.session.userId)
  if (req.session.userId) {
      next()
  } else {
      res.sendFile(path.join(fePath,'/public/html/login.html'))
  }
}

//Validate users email, if duplicate send 400 error to user
app.post('/account/register/validateDuplicate', (req, res) => {
  const data = req.body
  validateDuplicate(data.email).then(result => {
    if (result === false) {
      duplicate = false
      res.json(200)
    } else {
      duplicate = false
      res.json(400)
    }
  })
})

//Create user and insert him into DB with secure password
app.post('/account/register', (req, res) => {
    const data = req.body
    validateDuplicate(data.email).then(result => {
      if (duplicate == false) {
        id = uuidv4()
        bcrypt.genSalt(saltRounds, (err, salt ) => {
          bcrypt.hash(data.password, salt, (err, hash) => {
            insertUser(data.nickname, data.email, hash, id).then(result => {
              if (result) {
                  res.json(200)
                  console.log(`User ${data.nickname} created. ID: ${id} Email: ${data.email} Pass: ${hash}`)
              }
            })
          })
        })
      }
    })
 })

 //Check if user inserts right data then insert session into DB
 app.post('/account/login', (req, res) =>{
  const data = req.body
  getUser(data.email, data.password).then(result => {
    let userData = result
    bcrypt.compare(data.password, userData.rows[0].pass, (err, result) => {
      if(result){
        req.session.regenerate(function (err) {
          if (err) next(err)
          saveSess(userData.rows[0].id, req.session, req.session.cookie._expires)
          req.session.userId = userData.rows[0].id
          console.log(req.session)
          req.session.save( (err) => {
            if (err) return next(err)
            //res.json(200)
            res.redirect('/dashboard')
          })
        })
      } else {
        res.json(400)
      }
    })
  })
})

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
  res.sendFile(path.join(fePath,'/public/html/dashboard.html'))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
