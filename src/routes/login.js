const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getUser } = require('../db/query.js')
const router = express.Router()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

router.post('/account/login', (req, res) => {
    const data = req.body

    getUser(data.email, data.password)
        .then(result => {
            if (result.rows.length === 0) {
                return res.status(400).send({ status: 400, message: 'Invalid credentials' })
            }

            const userData = result

            bcrypt.compare(data.password, userData.rows[0].pass, (err, match) => {
                if (err) {
                    console.error(err)
                    return res.status(500).send({ status: 500, message: 'Error comparing passwords' })
                }

                if (match) {
                    const userId = userData.rows[0].id
                    const username = userData.rows[0].username
                    const email = userData.rows[0].email

                    const token = jwt.sign(
                        { userId, username, email },
                        JWT_SECRET_KEY,
                        { expiresIn: '7d' }
                    )

                    res.send({
                        status: 200,
                        message: 'Login successful',
                        token,
                        user: {
                            userId,
                            username,
                            email
                        }
                    })
                } else {
                    res.status(400).send({ status: 400, message: 'Invalid credentials' })
                }
            })
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({ status: 500, message: 'Server error' })
        })
})

module.exports = router
