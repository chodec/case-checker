const express = require('express')
const bcrypt = require('bcrypt')
const { getUser } = require('../db/query.js')
const router = express.Router()

 //Check if user inserts right data then insert session into DB
router.post('/account/login', (req, res) =>{
    const data = req.body
    getUser(data.email, data.password).then(result => {
      let userData = result
      bcrypt.compare(data.password, userData.rows[0].pass, (err, result) => {
        if(result){
          req.session.userId = userData.rows[0].id
          res.send({ status: 200 })
        } else {
          res.send({ status: 400 })
        }
      })
    })
  })

  module.exports = router