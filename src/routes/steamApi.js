const express = require('express')
const fs = require('fs')
const router = express.Router()
const axios = require('axios')


//https://stackoverflow.com/questions/29902280/get-price-of-item-in-steam-community-market-with-json
//get current item value


router.get('/pricehistory/case/:filename', (req, res) => {
    const filename = req.params.filename
    const encodedFileName = encodeURIComponent(filename)
    const pathToFile = `./src/db/json/${encodedFileName}.json`
    fs.readFile(pathToFile, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file')
        } else {
            const jsonData = JSON.parse(data)
            res.json(jsonData)
        }
    })
})

router.get('/currentprice/case/:filename', (req, res) =>{
    const filename = req.params.filename
    const encodedFileName = encodeURIComponent(filename)
    axios.get(`https://steamcommunity.com/market/priceoverview/?appid=730&market_hash_name=${encodedFileName}&currency=1`).then(function(data) {
        if (data.status === 200){
            res.send(data.data)
        } else {
            res.status(500).send('Error reading file')
        }
    })
})

module.exports = router