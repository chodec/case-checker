const express = require('express')
const { countUserAssets } = require('../db/query.js')
const router = express.Router()

router.post('/asset/countUserAssets', (req, res) => {
    const { email } = req.body

    countUserAssets(email)
        .then(totalAssets => {
            if (totalAssets !== false) {
                res.json({ total_assets: totalAssets })
            } else {
                res.status(404).send({ error: "User or assets not found" })
            }
        })
        .catch(err => {
            console.error(err)
            res.status(500).send({ error: "An error occurred while counting assets" })
        })
})

module.exports = router
