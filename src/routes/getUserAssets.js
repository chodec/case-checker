const express = require('express')
const { getUserAssets } = require('../db/query.js')
const { verifyToken } = require('../middlewares/auth.js')
const router = express.Router()

router.post('/getUserAssets', verifyToken, (req, res) => {
    const { email, limit = 10, offset = 0 } = req.body

    getUserAssets(email, limit, offset)
        .then(result => {
            if (result) {
                res.json(result)
            } else {
                res.status(404).send({ error: "No assets found" })
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({ error: "An error occurred while retrieving assets" })
        })
})

module.exports = router
