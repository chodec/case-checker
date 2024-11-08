const express = require('express')
const { validateDuplicate} = require('../db/query.js')
const router = express.Router()

router.post('/account/register/validateDuplicate', (req, res) => {
    const data = req.body
    validateDuplicate(data.email).then(result => {
        if (result === false) {
            res.send({ status: 200 })
            return '200'
        } else {
            res.send({ status: 400 })
            return '400'
        }
    })
})

module.exports = router