const express = require('express')
const fs = require('fs')
const router = express.Router()
const { verifyToken } = require('../middlewares/auth.js')
const axios = require('axios')

router.get('/pricehistory/case/:filename', verifyToken, (req, res) => {
    const filename = req.params.filename
    const encodedFileName = encodeURIComponent(filename)
    const pathToFile = `./src/db/json/${encodedFileName}.json`
    fs.readFile(pathToFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file')
        } else {
            try {
                const jsonData = JSON.parse(data)
                res.json(jsonData)
            } catch (parseError) {
                res.status(500).send('Error parsing JSON data')
            }
        }
    })
})

router.get('/currentprice/case/:filename', verifyToken, (req, res) => {
    const filename = req.params.filename
    const encodedFileName = encodeURIComponent(filename)
    axios.get(`https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${encodedFileName}&currency=1`)
        .then((data) => {
            if (data.status === 200) {
                res.send(data.data)
            } else {
                res.status(500).send('Error fetching current price data')
            }
        })
        .catch((error) => {
            console.error('Error with axios request:', error.message)
            res.status(500).send('Error fetching data from Steam API')
        })
})

module.exports = router
