const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require("body-parser")
const { Client } = require('pg')
const { v4: uuidv4,} = require('uuid')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport')
const { Strategy } = require('passport-local')
const cookieParser = require('cookie-parser')
require('dotenv').config()

let queryDuplicate
let duplicate = true
let userData = []

const app = express()
const port = 3000

const saltRounds = 10

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())

const makeCookie = () => {
  const cookie = new session.Cookie()
  cookie.maxAge = 10000 
  cookie.secure = true
  cookie.domain = 'http://127.0.0.1:3000/'

  return cookie
}

app.use(cors({origin: 'http://localhost:5500'}));

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

app.post('/account/register/validateDuplicate', cors(), (req, res) => {
  const data = req.body
  validateDuplicate(data.email).then(result => {
    if (duplicate === true) {
      res.json(queryDuplicate.rows[0].email)
    }
  })
})

app.post('/account/login', cors(), (req, res) =>{
  const data = req.body
  let userState = ''
  getUser(data.email, data.password).then(result => {
    bcrypt.compare(data.password, userData.rows[0].pass, (error, response) => {
      if(response) {
        const sessionId = uuidv4()
        makeCookie()
        userState = 'success'
      } else {
        userState = 'failed'
      }
      //res.json(userState)
      console.log(`User ${data.email} has ${userState} log in.`)
    })
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

 app.get('/', (req,res) => {
  res.cookie("kokot").send("megakokot")
 })

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})