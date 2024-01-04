const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require("body-parser")
const { Client, Pool } = require('pg')
const { v4: uuidv4,} = require('uuid')
const cors = require('cors')

const pool = new Pool()
let queryDuplicate
let duplicate = true

const app = express()
const port = 3000

const saltRounds = 10

const insertUser = async (username, email, pass, id) => {

  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    password: 'F.aq9173',
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

const validateDuplicate = async (email) => {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'users',
    password: 'F.aq9173',
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

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cors({origin: 'http://localhost:5500'}));

app.post('/validateDuplicate', cors(), (req, res) => {
  const data = req.body

  validateDuplicate(data.email).then(result => {
    if (duplicate === true) {
      res.json(queryDuplicate.rows[0].email)
    }
  })
})

app.post('/', function(req, res){
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

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})