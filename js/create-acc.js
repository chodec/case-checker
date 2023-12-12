const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require("body-parser")

const app = express()
const port = 3000

const saltRounds = 10
let passHash
let emailHash

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.send('Hello  kokot!')
// })

app.post('/', function(req, res){
    const data = req.body
    passHash = data.password
    bcrypt.genSalt(saltRounds, (err, salt ) => {
      
    })
 })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})