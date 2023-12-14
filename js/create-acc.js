const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require("body-parser")

const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'users',
  password: 'F.aq9173',
  port: 5432,
})

const app = express()
const port = 3000

const saltRounds = 10
let passHash
let emailHash



const insertUser = async (username, email, pass) => {
  try {
      await client.connect()
      await client.query(
          `INSERT INTO users (username, email, pass) 
           VALUES ($1, $2, $3)`, [username, email, pass])
      return true
  } catch (error) {
      console.error(error.stack)
      return false;
  } finally {
      await client.end()
  }
}

const hashData = (str) => {
  bcrypt.genSalt(saltRounds, (err, salt ) => {
    bcrypt.hash(str, salt, (err, hash) => {
      console.log(hash);
    })
  })
}

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json());

app.post('/', function(req, res){
    const data = req.body
    bcrypt.genSalt(saltRounds, (err, salt ) => {
      bcrypt.hash(data.password, salt, (err, hash) => {
        insertUser(data.nickname, data.email, hash).then(result => {
          if (result) {
              console.log(result);
          }
      });
      })
    })
 })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})