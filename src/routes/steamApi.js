const express = require('express')
const fs = require('fs')
const router = express.Router()

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

module.exports = router