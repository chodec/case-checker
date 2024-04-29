const express = require('express')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const { insertUser, validateDuplicate} = require('../db/query.js')
const router = express.Router()

const saltRounds = 10

//Create user and insert him into DB with secure password
router.post('/account/register', (req, res) => {
    const data = req.body
    validateDuplicate(data.email).then(result => {
        if (result === false) {
            id = uuidv4()
            bcrypt.genSalt(saltRounds, (err, salt ) => {
                bcrypt.hash(data.password, salt, (err, hash) => {
                    insertUser(data.nickname, data.email, hash, id).then(result => {
                        if (result) {
                            res.send({ status: 200 })
                            console.log(`User ${data.nickname} created. ID: ${id} Email: ${data.email} Pass: ${hash}`)
                        }
                    })
                })
            })
        }
    })
})

module.exports = router