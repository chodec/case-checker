const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const { Client } = require('pg')
const { v4: uuidv4,} = require('uuid')
const session = require('express-session')
const path = require('path')
require('dotenv').config()

let queryDuplicate
let duplicate = true
let userData = []

const app = express()
const port = 3000

const saltRounds = 10

let fePath = path.join(__dirname, '../');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static(fePath + '/public'));

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
}));

const requireAuth = (req, res, next) => {
  console.log(req.session.user)
  if (req.session.user) {
      next()
  } else {
      res.redirect('/login')
  }
}

const insertUser = async (username, email, pass, id) => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    password: process.env.DB_PASS,
    port: '5432'
  })
  try {
      await client.connect()
      await client.query(
          `INSERT INTO users (username, email, pass, id) 
           VALUES ($1, $2, $3, $4)`, [username, email, pass, id])
      return true
  } catch (error) {
      console.error(error.stack)
      return false
  } finally {
      await client.end()
  }
}

const getUser = async (email, pass) => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    password: process.env.DB_PASS,
    port: '5432'
  })
  try {
      await client.connect()
      userData = await client.query(
          `SELECT email, pass FROM users 
            WHERE email=($1)`, [email])
      return true
  } catch (error) {
      console.error(error.stack)
      return false
  } finally {
      await client.end()
  }
}


const validateDuplicate = async (email) => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    password: process.env.DB_PASS,
    port: '5432'
  })
  try {
      await client.connect()
      queryDuplicate = await client.query(`SELECT email FROM users WHERE email = $1`, [email])
      await client.end()
      if (queryDuplicate.rowCount >= 1) {
        duplicate = true
      } else if (queryDuplicate.rowCount == 0) {
        duplicate = false
      }
      return true
  } catch (error) {
      console.error(error.stack)
      return false
  } finally {
      await client.end()
  }
}

app.post('/account/register/validateDuplicate', (req, res) => {
  const data = req.body
  validateDuplicate(data.email).then(result => {
    if (duplicate === true) {
      res.json(queryDuplicate.rows[0].email)
    }
  })
})

app.post('/account/register', (req, res) => {
    const data = req.body
    validateDuplicate(data.email).then(result => {
      if (duplicate == false) {
        id = uuidv4()
        bcrypt.genSalt(saltRounds, (err, salt ) => {
          bcrypt.hash(data.password, salt, (err, hash) => {
            insertUser(data.nickname, data.email, hash, id).then(result => {
              if (result) {
                  console.log(`User ${data.nickname} created. ID: ${id} Email: ${data.email} Pass: ${hash}`)
              }
            })
          })
        })
      }
    })
 })

 app.post('/account/login', (req, res) =>{
  const data = req.body
  getUser(data.email, data.password).then(result => {
    bcrypt.compare(data.password, userData.rows[0].pass, (error, result) => {
      if(result){
        req.session.user = data.email
        req.session.isAuth = true
        req.session.save( (err) => {
          if (err) return next(err)
          res.json(200)
        })
      } else {
        res.json(400)
      }
    })
  })
})

app.get('/', (req, res) => {
  res.sendFile(path.join(fePath,'index.html'))
})

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(fePath,'login.html'))
})

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(fePath,'register.html'))
})

app.get('/dashboard.html', (req, res) => {
  console.log()
  res.sendFile(path.join(fePath,'dashboard.html'))
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
